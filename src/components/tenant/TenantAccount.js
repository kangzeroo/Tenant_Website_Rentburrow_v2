// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import Dropzone from 'react-dropzone'
import { withRouter } from 'react-router-dom'
import {
  Image,
  Form,
  Button,
  Header,
  Icon,
  Progress,
} from 'semantic-ui-react'
import {
  updateTenantProfile,
  getTenantProfile,
  insertStudentCard,
  getStudentCard,
} from '../../api/auth/tenant_api'
import { saveTenantToRedux } from '../../actions/auth/auth_actions'
import { filterNonImages, uploadImageToS3WithEncryption, getEncryptedS3Image } from '../../api/aws/aws-S3'
import { authenticateTenant } from '../../api/general/general_api'

class TenantAccount extends Component {

  constructor() {
    super()
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',

      student_card: '',

      saving: false,
      profile_saved: false,
    }
  }

  componentWillMount() {
    if (authenticateTenant(this.props.tenant_profile)) {
      this.setState({
        first_name: this.props.tenant_profile.first_name,
        last_name: this.props.tenant_profile.last_name,
        email: this.props.tenant_profile.email ? this.props.tenant_profile.email : '',
        phone: this.props.tenant_profile.phone ? this.props.tenant_profile.phone : '',
      })
      // getStudentCard({ tenant_id: this.props.tenant_profile.tenant_id }).then((data) => {
      //   if (data) {
      //     getEncryptedS3Image(data.student_card, `${this.props.tenant_profile.tenant_id}/`).then((data) => {
      // 			this.setState({
      // 				student_card: data.image_blob
      // 			})
      // 		})
      //   } else {
      //     this.setState({
      //       student_card: ''
      //     })
      //   }
      // })
    } else {
      this.props.history.push('/')
    }
  }

  updateAttr(e, attr) {
		this.setState({
			[attr]: e.target.value,
		})
	}

  saveProfile() {
    this.setState({
      saving: true
    }, () => {
      // uploadImageToS3WithEncryption(this.state.student_card, `${this.props.tenant_profile.tenant_id}/`, 'student_card-')
  			// .then((S3Obj) => {
        //   return insertStudentCard({
        //     tenant_id: this.props.tenant_profile.tenant_id,
        //     student_card: S3Obj.Location
        //   })
  			// })
        // .then(() => {
  			// 	return updateTenantProfile({
        //     tenant_id: this.props.tenant_profile.tenant_id,
        //     first_name: this.state.first_name,
        //     last_name: this.state.last_name,
        //     email: this.state.email,
        //     phone: this.state.phone,
        //   })
        // })
        updateTenantProfile({
          tenant_id: this.props.tenant_profile.tenant_id,
          first_name: this.state.first_name,
          last_name: this.state.last_name,
          email: this.state.email,
          phone: this.state.phone,
        }).then(() => {
          this.setState({
            profile_saved: true,
            saving: false,
          })
          return getTenantProfile({ tenant_id: this.props.tenant_profile.tenant_id, })
        })
        .then((data) => {
          this.props.saveTenantToRedux(data)
        })
    })
  }

  // upload just 1 photo
  uploadPhoto(acceptedFiles, rejectedFiles, attr) {
    const filteredFiles = filterNonImages(acceptedFiles)
    this.setState({
      [attr]: filteredFiles[0]
    })
  }

	render() {
		return (
			<div style={comStyles().container}>
        {
          this.state.saving
          ?
          <Progress
            color='blue'
            percent={this.state.profile_saved ? 100 : 50}
            active
            success={this.state.profile_saved}
          />
          :
          null
        }
        <div style={comStyles().formContainer}>
          {
            this.state.profile_saved
            ?
            <Button color='blue' content='Back' onClick={() => this.props.history.goBack()} style={comStyles().back_button} />
            :
            null
          }
          <Header as='h2'>
            <Image
              shape='circular'
              src={this.props.tenant_profile.thumbnail}
            />
            Update Profile
          </Header>
          <div style={comStyles().horizontal_form}>
            <Form style={comStyles().basic_form}>
              <Form.Field>
                <Form.Input
                  label='First Name'
                  placeholder='First name'
                  value={this.state.first_name}
                  onChange={(e) => this.updateAttr(e, 'first_name')}
                />
                <Form.Input
                  label='Last Name'
                  placeholder='Last Name'
                  value={this.state.last_name}
                  onChange={(e) => this.updateAttr(e, 'last_name')}
                />
                <Form.Input
                  label='Email'
                  placeholder='Email'
                  value={this.state.email}
                  onChange={(e) => this.updateAttr(e, 'email')}
                />
                <Form.Input
                  label='Phone Number'
                  placeholder='Phone Number'
                  value={this.state.phone}
                  onChange={(e) => this.updateAttr(e, 'phone')}
                />
              </Form.Field>
            </Form>
            {/*<div style={comStyles().student_card}>
              <Form.Field>
                <Dropzone onDrop={(acceptedFiles, rejectedFiles) => this.uploadPhoto(acceptedFiles, rejectedFiles, 'student_card')} style={comStyles().bannerDropzone} multiple={false}>
                  {
                    this.state.student_card
                    ?
                    <div>
                      {
                        this.state.student_card && this.state.student_card.name
                        ?
                        <Image key={this.state.student_card.name} src={this.state.student_card.preview} style={comStyles().uploadImagesQueue} />
                        :
                        <Image key='student_card' src={this.state.student_card} style={comStyles().uploadImagesQueue} />
                      }
                    </div>
                    :
                    <div style={comStyles().upload_student_card_placeholder}>
                      <Icon name='user' size='huge' />
                      <div style={comStyles().upload_student_card_text}>Upload Student Card</div>
                    </div>
                  }
                </Dropzone>
                <div style={comStyles().click_image_to_change}>Click on image to change Student Card</div>
              </Form.Field>
            </div>*/}
          </div>
        </div>
        <div style={comStyles().buttons_container} >
          <Button
            primary
            content='Save Profile'
            onClick={() => this.saveProfile()}
          />
        </div>
			</div>
		)
	}
}

// defines the types of variables in this.props
TenantAccount.propTypes = {
	history: PropTypes.object.isRequired,
  tenant_profile: PropTypes.object,
  saveTenantToRedux: PropTypes.func.isRequired,
}

// for all optional props, define a default value
TenantAccount.defaultProps = {
  tenant_profile: {}
}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(TenantAccount)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {
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
    success: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    formContainer: {
      display: 'flex',
      flexDirection: 'column',
      margin: '30px',
    },
    buttons_container: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      margin: '30px 0px 0px 30px'
    },
    horizontal_form: {
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
    },
    basic_form: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
    },
    student_card: {
      display: 'flex',
      flexDirection: 'column',
      width: '50%',
      padding: '30px',
    },
    upload_student_card_placeholder: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      width: '100%',
    },
    upload_student_card_text: {
      margin: '15px auto',
      fontSize: '1.1rem',
      fontWeight: 'bold',
    },
    click_image_to_change: {
      margin: '10px auto',
      width: '100%',
    },
    back_button: {
      width: '150px',
    }
	}
}
