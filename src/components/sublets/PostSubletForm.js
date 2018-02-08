// Compt for copying as a PostSubletForm
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Dropzone from 'react-dropzone'
import Rx from 'rxjs'
import uuid from 'uuid'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import {
  Form,
  Input,
  TextArea,
  Checkbox,
  Dropdown,
  Icon,
  Image,
  Header,
  Modal,
  Button,
  Message,
} from 'semantic-ui-react'
import { uploadImageToS3, filterNonImages } from '../../api/aws/aws-S3'
import { loginFacebook, insertUser, initiateFacebook } from '../../api/auth/facebook_auth'
import { saveTenantToRedux } from '../../actions/auth/auth_actions'
import { saveTenantProfile, getTenantProfile } from '../../api/auth/tenant_api'
import { postSubletToDynamoDB } from '../../api/search/sublet_api'


class PostSubletForm extends Component {

  constructor() {
    super()
    this.state = {
      application_template: {
        address: '',
        description: '',
        price: 500,
        phone: '',

        rooms_left: 1,
        utils_incl: true,
        female_only: false,
        ensuite_bath: false,

        fb_group_id: '',
        fb_user_id: '',
        fb_user_pic: '',
        fb_user_name: '',

        images: [],
        place_id: '',
        gps_x: 0,
        gps_y: 0,
        post_id: uuid.v4(),
        posted_date: 0,
        scrapped_at: moment().valueOf(),
      },
      pre_images: [],
			error_messages: [],
			submitted: false,
      loading: false,

      fb_loading: false,
      toggle_modal: false,
      modal_name: '',
      context: null,
    }
    this.room_options = [
      { key: 'one', text: '1', value: 1 },
      { key: 'two', text: '2', value: 2 },
      { key: 'three', text: '3', value: 3 },
      { key: 'four', text: '4', value: 4 },
      { key: 'five', text: '5', value: 5 },
      { key: 'six', text: '6', value: 6 },
      { key: 'seven', text: '7', value: 7 },
      { key: 'eight', text: '8', value: 8 },
      { key: 'nine', text: '9', value: 9 },
      { key: 'ten', text: '10', value: 10 },
      { key: 'plus', text: '10+', value: 11 },
    ]
  }

  componentDidMount() {
    // google address autocomplete
    this.autocomplete = new google.maps.places.Autocomplete(
            /** @type {!HTMLInputElement} */(document.getElementById('building_address')),
            { types: ['geocode'] });
    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    this.autocomplete.addListener('place_changed', this.fillInAddress.bind(this));
	}

  // fill in address from google autocomplete dropdown
  fillInAddress() {
		const place = this.autocomplete.getPlace()

		this.setState({
      application_template: {
        ...this.state.application_template,
        address: place.formatted_address,
  			gps_x: place.geometry.location.lat().toFixed(7),
        gps_y: place.geometry.location.lng().toFixed(7),
  			place_id: place.place_id,
      }
		})
	}

	updateApplicationAttr(e, attr) {
    this.setState({
      application_template: {
        ...this.state.application_template,
        [attr]: e.target.value,
      }
    })
  }

  toggleBoolApplication(e, d, attr) {
    this.setState({
      application_template: {
        ...this.state.application_template,
        [attr]: !this.state.application_template[attr]
      }
    })
  }

  uploadPhotos(acceptedFiles, rejectedFiles) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      pre_images: this.state.pre_images.concat(filteredFiles)
    })
  }

  submitSublet() {
    if (this.props.authenticated && this.props.tenant_profile.fb_user_id) {
      if (this.validateForm()) {
        this.setState({
          loading: true,
        })
        const post_id = uuid.v4()
        this.uploadImages(post_id)
          .then((data) => {
            // console.log(data)
            this.setState({
              application_template: {
                ...this.state.application_template,
                images: JSON.stringify(data.map((img) => img.Location)),
                fb_group_id: 'RENTHERO',
                fb_user_id: this.props.tenant_profile.fb_user_id,
                fb_user_pic: this.props.tenant_profile.thumbnail,
                fb_user_name: `${this.props.tenant_profile.first_name} ${this.props.tenant_profile.last_name}`,
                posted_date: moment().valueOf(),
              }
            }, () => {
              postSubletToDynamoDB(this.state.application_template).then((data) => {
                // console.log(data)
                this.setState({
                  loading: false,
                  submitted: true,
                })
              }).catch((err) => {
                // console.log(err)
                this.setState({
                  loading: false,
                  error_messages: ['An error occurred while posting your sublet. Please try again or message us using the chat at the bottom right of the window']
                })
              })
            })
          })
      }
    } else {
      this.toggleModal(true, 'fb')
    }
  }

  uploadImages(post_id) {
    const p = new Promise((res, rej) => {
  		const promises = this.state.pre_images.map((img, index) => {
  			return this.savePhotoToDB(img, post_id)
  		})
  		Promise.all(promises)
        .then((results) => {
          res(results)
    		}).catch((err) => {
    			this.setState({
            error_messages: ['An occurred while uploading images']
          })
          rej()
    		})
    })
    return p
  }

  savePhotoToDB(image, post_id) {
		const p = new Promise((res, rej) => {
			const tenant_id = this.props.tenant_profile.tenant_id

			uploadImageToS3(image, 'tenant/', `${tenant_id}/sublet_post/${post_id}/sublet_images/`)
				.then((img) => {
					res(img)
				})
        .catch((err) => {
          rej(err)
        })
			})
		return p
	}

  toggleModal(bool, attr, context) {
    this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context: context
    })
  }

  validateForm() {
    const error_messages = []
    if (!this.state.application_template.address) {
      error_messages.push('You must provide a valid address')
    }
    if (!this.state.application_template.place_id || !this.state.application_template.gps_x || !this.state.application_template.gps_y) {
      error_messages.push('You must select an address from the Google Address dropdown menu')
    }
    if (!this.state.application_template.description) {
      error_messages.push('You must provide a description')
    }
    if (!this.state.application_template.price) {
      error_messages.push('You must provide a monthly rent price')
    }
    this.setState({
      error_messages: error_messages,
      submitted: false,
    })
    return error_messages.length === 0
  }

  renderAppropriateModal(modal_name, context) {
    if (modal_name === 'fb') {
      return this.renderFacebookLogin()
      // return this.renderLoginSuite('signup')
    }
    return null
  }

  loginWithFacebook() {
    this.setState({
      fb_loading: true,
    })
    localStorage.removeItem('fbToken')
    initiateFacebook()
      .then(() => {
        return loginFacebook()
      })
      .then((fbProfile) => {
        // insertUser(fbProfile)
        return saveTenantProfile(fbProfile)
      })
      .then((data) => {
        return getTenantProfile({ tenant_id: data.tenant_id, })
      })
      .then((data) => {
        this.props.saveTenantToRedux(data)
        this.toggleModal(false)
        this.setState({
          fb_loading: false,
        })
      })
  }

  renderFacebookLogin() {
    return (
      <Modal dimmer='blurring' open={this.state.toggle_modal} onClose={() => this.toggleModal(false)}>
        <div style={{ display: 'flex', flexDirection: 'column', padding: '30px' }}>
          <Button
            onClick={() => this.loginWithFacebook()}
            content='Log In with Facebook'
            color='facebook'
            icon='facebook'
            size='medium'
            loading={this.state.fb_loading}
          />
        </div>
      </Modal>
    )
  }

	render() {
		return (
			<div id='PostSubletForm' style={comStyles().container}>
        <Form style={comStyles().form}>
          <Header as='h2' icon style={{ width: '100%' }}>
            <Icon name='home' />
            Post Sublet
            <Header.Subheader>
              Advertise your 4 month sublet on RentHero for free <br/>
              Facebook login required
            </Header.Subheader>
          </Header>
          <br />
          <Form.Field>
            <label>Address</label>
            <Input
              id='building_address'
              value={this.state.application_template.address}
              onChange={(e) => this.updateApplicationAttr(e, 'address')}
            />
          </Form.Field>
          <Form.Field style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <label>Price</label>
              <Input
                type='number'
                value={this.state.application_template.price}
                onChange={(e) => this.updateApplicationAttr(e, 'price')}
              />
            </div>
            &nbsp; &nbsp;
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <label>Number of Rooms</label>
              <Dropdown
                id='num_rooms'
                placeholder='Select Number of Rooms'
                value={this.state.application_template.rooms_left}
                selection
                options={this.room_options}
                onChange={(e, d) => this.updateApplicationAttr({ target: { value: d.value } }, 'rooms_left')}
              />
            </div>
            &nbsp; &nbsp;
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <label>Contact Phone Number</label>
              <Input
                type='number'
                value={this.state.application_template.phone}
                onChange={(e) => this.updateApplicationAttr(e, 'phone')}
              />
            </div>
          </Form.Field>
          <Form.Field>
            <label>Description</label>
            <TextArea
              placeholder='Describe your sublet'
              value={this.state.application_template.description}
              onChange={(e) => this.updateApplicationAttr(e, 'description')}
            />
          </Form.Field>
          <Form.Field style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'space-around' }}>
            <Checkbox toggle label='Utilities Included' checked={this.state.application_template.utils_incl} onClick={(e, d) => this.toggleBoolApplication(e, d, 'utils_incl')} /> &nbsp; &nbsp;
            <Checkbox toggle label='Female Only' checked={this.state.application_template.female_only} onClick={(e, d) => this.toggleBoolApplication(e, d, 'female_only')} /> &nbsp; &nbsp;
            <Checkbox toggle label='Ensuite Bath' checked={this.state.application_template.ensuite_bath} onClick={(e, d) => this.toggleBoolApplication(e, d, 'ensuite_bath')} /> &nbsp; &nbsp;
          </Form.Field>
          <Form.Field>
            <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhotos(acceptedFiles, rejectedFiles)} style={comStyles().imageDropzone} multiple={true}>
              {
                this.state.pre_images.length > 0
                ?
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                  {
                    this.state.pre_images.map((img) => {
                      return (
                        <Image key={img.name} src={img.preview} style={comStyles().uploadImagesQueue} />
                      )
                    })
                  }
                </div>
                :
                <div>Upload Images</div>
              }
            </Dropzone>
          </Form.Field>
          <Form.Field>
            {
              this.state.error_messages.map((err, index) => {
                return (
                  <Message
                    visible
                    key={index}
                    error
                    content={err}
                  />
                )
              })
            }
          </Form.Field>
          <Form.Field>
            {
              this.state.submitted
              ?
              <div>
                <Button primary onClick={() => this.props.history.push('/my-ads')} style={{ width: '100%' }}>Success! View My Ads</Button>
              </div>
              :
              <Button primary loading={this.state.loading} onClick={() => this.submitSublet()} style={{ width: '100%' }}>SUBMIT</Button>
            }
          </Form.Field>
        </Form>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
PostSubletForm.propTypes = {
	history: PropTypes.object.isRequired,
  authenticated: PropTypes.bool,
  saveTenantToRedux: PropTypes.func.isRequired,
  tenant_profile: PropTypes.object.isRequired,
}

// for all optional props, define a default value
PostSubletForm.defaultProps = {
  authenticated: false,
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(PostSubletForm)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
    authenticated: redux.auth.authenticated,
    tenant_profile: redux.auth.tenant_profile,
	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
    saveTenantToRedux,
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
		},
    imageDropzone: {
      width: '100%',
      height: '200px',
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      border: '1px solid rgba(0,0,0,0.2)',
      borderRadius: '10px',
      margin: '40px 0px 0px 0px',
    },
    uploadImagesQueue: {
      width: '75px',
      height: '75px',
      overflow: 'hidden',
      margin: '5px',
    }
	}
}
