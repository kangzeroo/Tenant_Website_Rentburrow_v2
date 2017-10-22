// Compt for copying as a template
// This compt is used for...

import React, { Component } from 'react'
import { connect } from 'react-redux'
import Radium from 'radium'
import PropTypes from 'prop-types'
import Rx from 'rxjs'
import { withRouter } from 'react-router-dom'
import {
  Card,
  Modal,
  Label,
  Input,
  Image,
} from 'semantic-ui-react'
import HomeExplorer from '../home_explorer/HomeExplorer'


class StepByStepCard extends Component {
  constructor() {
		super()
		this.state = {
			toggle_modal: false,
      modal_name: '',
      context: {},
		}
	}

  signAndPayOnline() {
    // this.toggleModal(true, 'sign_pay_online')
    window.open(`${window.location.origin}/signing/lease/${this.props.building.building_id}`, '_blank')
  }

  toggleModal(bool, attr, context) {
		this.setState({
      toggle_modal: bool,
      modal_name: attr,
      context,
    })
  }

  renderAppropriateModal(modal_name, context) {
		if (modal_name === 'virtual_tour') {
      return (
	      <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
	        <Modal.Content>
						<HomeExplorer
							building={this.props.building}
							current_suite={context}
							all_suites={this.props.all_suites}
              showVirtualTourFirst
						/>
	        </Modal.Content>
	      </Modal>
	    )
		} else if (modal_name === 'social_share') {
      return (
        <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
	        <Modal.Content>
            {/*
              this.generateSocialLinks()
            */}
            {
              this.generateShareURL()
            }
	        </Modal.Content>
	      </Modal>
      )
    } else if (modal_name === 'sign_pay_online') {
      return (
        <Modal
					dimmer
					open={this.state.toggle_modal}
					onClose={() => this.toggleModal(false)}
					closeIcon
					size='fullscreen'
				>
          {/*<Modal.Content>
            {
              this.generatePaymentOptions()
            }
          </Modal.Content>*/}
          {
            this.generateComingSoon()
          }
	      </Modal>
      )
    }
  }

  generateShareURL() {
    return (
      <div style={comStyles().share_div}>
        <Input
          action={{ color: 'teal', labelPosition: 'left', icon: 'external share', content: 'Share Link' }}
          actionPosition='left'
          fluid
          value={window.location}
        />
      </div>
    )
  }

  generateComingSoon() {
    return (
      <div style={comStyles().coming_soon_div}>
        <h1>Sign & Pay Online</h1>
        <br/>
        <br/>
        <Image src='https://s3.amazonaws.com/rentburrow-static-assets/Images/comingsoon.png' spaced />
        <br/>
        <br/>
        <h1>Renting is about to get a lot easier</h1>
      </div>
    )
  }

  generateSocialLinks() {
    return (
      <div style={comStyles().icons}>
        <img
          className='icon icons8-Facebook'
          width='30'
          height='30'  src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGAAAABgCAYAAADimHc4AAAE4UlEQVR4Xu2dTWgcZRjH/88ksVaoolCMqEhidg1SsclsQVS0F2k9eLCg2Ivf2t0VD9KD4MmbID1J6kyKVMFb/bqIogcVxS/MboJYbHYWGxHEVhSlrYbYnUcSaE3WTZr3/Y/djHlyXN7fM9nfb4bMzg4TQYefUty4QxHsEqQ3ATIM4MJO6+y1cxqYheJbBb5QyOv1ytAH7YQsfqEUNW+BpGOAbD3naFvgbEAVNVXZU68O1c7AZwOMxo2HAshB56kGOBtIVXbVK0NvzYMLAUbi5PoAOimQC5ynGeBsQKGnWtq3ZaoyMLMQoBQldQhGnCcZ4G1Agfdr5cIOCceTe0RxyHuSgf4GVG6VUpS8A8Gd/lOM9DWgipekFDd+AeQy3yHG+RtQ6BEpxYn6jzCSMaDAHxaAMZgBawEykMiMsACMvQxYC5CBRGaEBWDsZcBagAwkMiMsAGMvA3Y9BJi/Jl+D6GepBp9LkP4ord7fROX3r54Y+MnVYdafm/63AVT1pASyb27jpn1f399/ylX0custwGpMKl5tbcDeyYcLP69mucsaC7CSLdXTQPDURGVozEWqy1oLsIKtVPWueqX4totQ17UWYDljirGJSuFJV6Gu6y1AB2MKnamViwOuMn3WW4BO1lSfnqgUn/cR6spYgHZjqqf/7Nt4+eFHr/7VVabPegvQZk0V79UqhZ0+Mn0YC9AeAHiuVi484yPTh7EA7QEE99b2FF7zkenDWIB2a2nP8ER1cNpHZjsTjs9cgfSvvSK6bf5+NUA2ZTF3pRm5vxY029PT/81jg8dYUaW4sVshkQCXsLNc+NwHONHXunj6keETLm/6X3t+3CgLJGJm+LK5DzBRLiy5w9tVxI3R9JW9IkcF0ufKZrF+3QcI48YLAvnPL2EsF2vdByjFyQ8Arspib/aZYQG6fGegBbAAPgfuPwz7RzjrD1au78aOADsCXPeZpevtCOD80bQFoBVyAywA54+mLQCtkBtgATh/NG0BaIXZntVk/OusOG7kYLK5Zw7HmW2uuc8B7B7NyHBltx1IbtcUH7lyi9dbAMJeGCdVAfYTI2ABCHthnOwXoEqMsACMvFKcfAhgOzPDjgDCXhglx0WwmRhhR4CvvBte/P7SDcEcfTeeHQGeBbI4A5rftAXwDJDFGZAF8JQ/j2VxBmQBiABZnAFZACJAFmdAazKAqxP20oV9J+xqvG29BSAFsrgFYA2SvAUgBbK4BWANkrwFIAWyuAVgDZK8BSAFsrgFYA2SvAUgBbK4BWANkrwFIAWyuAVgDZK8BSAFsrgFYA2SvAUgBbK4BWANkrwFIAWyuAVgDZK8BSAFsrgFYA2SvAUgBbK4BWANkrwFIAWyuAVgDZK8BSAFsrgFYA2SvAUgBbK4BWANkrwFIAWyuAVgDZJ87gOEUTIjgmtID13Dcx1A9TsJo8abInJ31wySG85zAFUcknC8+YCovkJ66Bqe5wBQ2S3bn9Xek/3No918eixTL68BVNGsHRu6buHB16Nxc2cAfZcR0S02rwHStOe2enXwk7NPHh+NGg8GIi93S6TvdvMYQBf9148lj37feqB5c29LxyHY4ivkfHN5CqDQL1sBylOPF6fOeOr47P3RKNkhovcBEgK4VoCLzrfY1W5vjQeYVcVhQD9NBW9Mlosft7+vvwFMMdxCHLSx9AAAAABJRU5ErkJggg==`}
        />
        <img
          className='icon icons8-WhatsApp'
          width='35'
          height='35'  src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEOUlEQVRoQ+1ZS3LbRhB9DUKid1FOELLK4Na0yX2kE4Q5galNBK5snSDUCUKtCGcj5gShThBkT9rIFnQVlRNYWdoG2anhxwaBAdAAQblcZWzR3fPeTH9nCF/5R185fnwj8KVPsLQTaP7uNytL/AjQKYFrADU/k2MPoHsG7gF2F3x06/Xqd2WQ34tAczivmUbwnJm7BKrlAcTgOwKNg6p55Z3X7/PohmULEWjezE/M98GvAF4WXXirp06FCIPg2LwuQiQ3gdartx0w3xBwsi/4sL4iwsyXr3uNUR67uQi0ndlvZex6KkBCf3JhXUlJiAm0HP+GQF2p4X3kGDxaVI8uJS4lIvCQ4D/HBo+mduM8ayMyCbSctwMCv8gydJD/jKtJz+qn2U4loAKWmP88CDih0SXzeVpgJxJQqbLyPpiXnW2EuD+Jqey0qJr1pHhIJNAezvogqFyf+jH4H+JVla0R4Ycs+UL/U1xJS0C6+wy6ntqPV8Vso3NHwHeFQKYopZ2CloBo9xl/T3rWaXjd1tAfEdHzsgkoe+HNymwlWo4/z+xtGGeTnuWGjamGzlzSm8MQ4Lup3ahHbcdOQApiYltJp+eCVFda/hewWY92sTEQz17NXhoM1TKkfkkEng39rkF0k6Vf5P+ScPn6whqkupDUj5MIHLLwMXA7ta1OKoH2cCZygcDgp94vDW8niA9d+DSJI+ZCLWf2TlK8mPmPaa+x09xJdYu4z1qHvYndeJp+As6MpQtEg0qUfqXGE+Sirhs7gXYOAgDciW2d7biR43sEerInzkT1TAKtvAAiZX5dkT+6hyKRSUAaxOEtigZ0GolN7zRmoJu3d1K6U7sRuu1A/GJLmkbDBFa9isFn4ay0JrHoh2cJBv5bsNncFiNVMwjUlxIRpVFpIYs6qY6EklFXLxV87IOoszD4NJp6lYy0+IkKmbSV0EVZEglJQLcd/83uZVhcS1d7tP1M7kAOrbW5fetP7ca1BPjqlNb3TO/S5Jnx77RnxS7PtASKulEEgIt1htrpWHUgRfUjYahJG2jKGk5cJhotjiu3urGw5fgvCLTToOlIBlXze53+3iOl1E02cqrPWp8I44TBncy5I2WYUWYSCZTkRjn5xcVXqbdq1nIP9S1nNibgp70R7GmAiX6eXjweJ5lJdqF8PdGeMPXqSXNwWDppLDwF4a+DoBIa1bXrOtWEOvAFrxNV0GpmjVwuJKmKwo3MLSZxm1QXklTF3KgECirbgKibFrAiF5I0VqqtBQwXUG9j+93EKeDEGASPzIHkPSBKIj4Ta27XPgEmuIvjirtdSJ2W8SHo0vqRL9cUpnobAkZFgW+JaIZ6fw4mUs+hDLjLR0djyc6ottkwgg4tuamqKxOfbEltdtlTL5NskLckdnVttcDTYiLxm7nhvFbWG24RQHl1Ml9o8hp8aPlvBB56x6Pr/Q97rhJPsZWaOQAAAABJRU5ErkJggg==`}
        />
        <img
          className='icon icons8-Weixing-Filled'
          width='35'
          height='35'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEf0lEQVRoQ+1ZTXIaVxD+Gg2Fd1FOYFEl2AYb9kEniHSCiE0EK+MTGJ3AZAXKRugEdk7g0R6syRZcJXSCKDu7mJlO9UgjhmHevPkBla0SG5WKfu/1179fN4Qn8qEnggPPQL43Tz575El4pDa43tuhxW8ANQnYZfAegfYEHAO3BFjyF2DTKeDS+qNqbRt44tCqnV/v7nxb/A6g6yudVDkGzwH0nVLxwmqVb5OeSyOXCEjjbPaOWQBgN83lYVnPW4T++KRymueeqLOxQGp/TWuGi3OAapt8WDzkFHC0yZBTAnk9mB4T0fu8XlAZwPMO42jcqZibMFIkEPHEjkuftgUiqDgTHU1O9j/mBbMG5DFB+FXOKfBB3jBbA9IYTq82nRN6a7M1bldf6eXUEitAXp/NugXGe6U449KGcSzfG7BHIPwa+3gKeZe59blTHWUFswKkPpxex/UIm42y1SlLT4A0RYPs67iH08hLJZu0q+XcQOpnXw6J+UOsYiXjZ7+hJQKSUj5P4j94pD6YjohIOnfcx7TZaHmhRfY5gOYm5Rn056S9383ilQcgjcHM1MZ8lhdSnPF5GoSrEVmTk/2LpMeXHtHkR9ILNyl3Tzw/Olw89XNTdf/SI8MZb1IJXTUDIB3dtGHMVwoIbGHRErJNP0KScLRAjszmRHi5TTDMfOGg2NNZ19fBGxew6AVy17RLxlEUg36UHGHGDQHHWXlVYzBrMjC6MzRbdql4EAaTtmqldhiD/3FKxWbeOeR+HjIJ9IuE5LhdOQgqswSSoI+kRcHAf07J2MsL4iHUvOHOnhPwU5gJrHb2wWbzJE+DUxnNb9xSAJySUfaNtAKkMZj1QHiX1vJR8hJSk3Z1bSB7eINxOu5UelFndTL14dSSEAt6ZY39+kJ5wahIYCNQ5sftSuQ8pJPxyS0Df0/alUPRdX0e8TYktiVxmAsM4yCqSumsLW/qZKSKgfAJjMtxp+LRpEiLSByCeZQHjMrauYwTOOx7zX9HObPfT4pmVjDfDRABn4TaKy2sCK1NeCRxaPmP1Ydf+gR+k+Vxl/D280mln+Ws7oxseApE57HJHrxENzHGP5h/Dlfd7+8Vgn0qNkcMl67WLmNccoH63r6X0STGLhNqUbm01YbIuJl0Kt6+WVm1vPwIhZXQDWbuJlkQBOr8SvfVhYzu+7vluX3lLc5D+zClR4Jh5dHvF8VuGs60nDij2apO6fD3d1UUH2Q5IvpMOlVvmxPrkbudL13lod9BtiobEmJqZaXxwaVhFAhlaHmdFYCKCyW1Zoh6g8GjJGNr+P5llYrmb0ogokCaMNIBiyCjsugwiWAuHOMmOOoWd+yXrss1+RFJ7nXYeIsXuDW+2f/K/3ZgxaQNLZ1iWb6PGFuTX0PosYuWTIiqSpjoh57kL+olxduFr4tDokKNmGvBFdR9Ts5lFSQeg+sehndtqXJEr87jSXiFx6H+cqMSvVp9dI9kNYHHyF3uS3jZBX4V/hnihwHiG0CaLVy+DTfmHw6IyqPPQLLG+rbOPXtkW5bNeu//CVF5UQS8ZlIAAAAASUVORK5CYII=`}
        />
        <img
          className='icon icons8-Message-Filled'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADuUlEQVRoQ+2ZQVIaQRSG/zdA4S7eILFK2IYSshZPEDxBYKOyEk8QcwJxBbqBnEByAnEdSZEtWKU5QcxOixleqht7bAaGmQkzSCxmRcn4uv9+3d/7X0N4JQ+9Eh1YCVm2TK4ysspIRCtAuXqfI4q90LArIQtdbh+DUea8l4kNqU3AGx/vL90rDPyxDM5L/EoxFrWI8HbpZjpjQsz4ZcW40N1Ld2VGxIdM43Y99jhoE+j9/yCGwT+tZCLfLW3cCw2Urfd/E2P3upxqj8SYTQI+LrMYZv5qrSUqQkSu1s8z4cKm1pC59KOcbgoB2VqvSUSfllGMENEpp4tiblu1XtEgaojP4/glHF/vp744X1oWQfpi5+r9EwAVNbeJOsLgZucgXVJiiKj60kQTZGLmir1j6r0GgWRWXIWMvuCumUzsqIP0knhWeFVAij8OLgHKOHfJjMrOXZMTu93yxt2o1qC5aKJJMhkoShG123dxGlxMEzF5RhwyGbi3DN55CTw78Rob0iUB627n1dNrCTEgKnX2N1sSzw+DatRE0/EqyEREJ7NEeGZEV78oPDPotHOwKWmk49WLnJ4Z0QM4iaYY7jWI3+/HFmsKmWbFCSRE8gzctJKJI0G07NlNAczCCcxlOAWZQFS0t+/j4MSJV6/FCCwkbDz7xWtEQmRqrq7LqbwYQKAxRoNWUDxLMnGiIBAv4mTrvW7QGB4FcbZ+ne/qzaDuWcerHWOOehV4a+loFIUyPkRjyDgNYjgnjR8OTQMlu179A+IDCRkSjn7sp6qaD7P5Pk6cmyqBD6flVcdrtt47JJCMJ+oVMx+pBdk661cMhjCGvh5fQsSBJEZB9CwiqtN5qpF0PD/1CRXV2zDwjRhVFSPrgtcpMVp+qOgpRD+Q4hy4mTZt2domx0vqADuXc+SZTNFDSFBMfzTT6rNznSlE38tPlxQz/c5zZnBPQJMMtL7vpa7E3z+c97d5iAIDRS+7obaa8nmSaB7NnqsQR5W197KvDRviSwyudA7Sp+pcurmJKY3V6HpFc7yBq2yIOmQo3U243fiMC2FcmWvxgmyoPPx/2JP1jqf1R+KsPpgtELYnCqKORftmYob/9x44/Df0lkKem/oz5sV1kOC33Q/nzvqfwTgOfxohRtQuSWzjOn5BZzYIKIQ4ZGShGGhZyXjJvqATIymr4dYPRzabOQMz+M4ysCuvTP22knOOGdm/K2vjWdkjm0HIgVdCQl7QucOtfp6eewlDDrDKSMgLOne4VUbmXsKQA7yajPwFMJWGIxUx33AAAAAASUVORK5CYII=`}
        />
        <img
          className='icon icons8-Link-Filled'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAEE0lEQVRoQ+2ZT1LbMBTGv2fSaXflBoWZOtumTboGbgAnIGwgWRVOAD1Bu0tgQzhB2xMQ1k2Ku407A70B7NrB+HUU4tSRZUsyicMwZOdYlt9P74/eJxMeyY8eCQeeQKbtyVrLX2XiTQIqAFXu5mePAY+YTnpNt5v1zrl7pHI0qJRC+gRgVbM43cDhPW+77KnGzRWkevhrHczHBCyaeJiBK2JsqLwzN5B3rUHdITo2AYiPETC3Dq/JnpkLSBoEA9+I8TlacZE3AA5AWJGAu72Guxb/r3CQNIiQeetHs9xReajaGnSIaDN+Tx5fKEgeiMj4anvgEehNdM3MJ/1muR5dFwZyHwhhrPw8gy/7jfJyoSCiOhHzFzlsssJJHjsq0+fx/3sNd+yImXuk0rpYWqDgXC6xNhDC+LmD1NqD8/879d162kIoQ4vxu990lwoJrWH5JJxOVBvC3o8d97Pt/iEvSKHJLpdNsU/0G+66LcS7Q3/XYYg2ZvwrtPzWWn53YjNjrEWbncidkhNsBmHpxGsuX6bBKasd46zXdCd6s5kme63t87jug3/2G+VhVysbF3BpWQWjgmDg+tbh1UJblAiEwT9vnz9b9baWr1JW+GOv6R7EvWK778zWIy2/y8SLmRAAZI/YQogFmCmIMCh88exrqicUpTgPxMxBolAxNa7aHnwgUKI0m+w7M/WIKrEjuLhx74/8lTDELgGJ0mwCcS+PqDS2aORG+nqYuDpPVI4vFkt/b07lnV8Fq9t7rD2SpbG11SmWE1kQosSCqN7fef1VB5CrRcnS2NOCAOMsWODdtEOGNDBjj2RpbBsIYUit5R8wUCfCK3EtngdDCKeO7tjnXiCmGluXE6Zhkmec1iOpxkld7DwhtFXL1DjdOJHYzp+b9bTDhTwekJ9J9YjOuGiiYRdLwYU8cVT/x9WJ6VruWKcBkFm1TCGixAVhP25UAmJ0lhvX2NOEUIaW2CcWQjo11diylk6DEC8rFCSPxh6GF4J6gFIn0hUJryrE0DS9MpEjqpAKc2tsX2j1sYqTNfY0IRKhldTY/1WdzYvFhifnDWIy12Yu07ETHqm2BxcEGh+xmHae8Zep5Wm+BTGFSHgkrrHFzcDhtzY9T6rG5lIl64DBxmCjFuU+IKltDNGGTRebF2oytFr+ZdTIiQlNQ8tm38lrqO45CUT+DsFer1F+mzXJQ4BI5ojiiJPBnX6jvKWCqR36+2BMHOPYeFK3yjb3E71W4nTwbrYuOTj4vu2eiQuhsTkcAiS+xJqGo42RJmMTIKPPAB4BL00miI+ZF4Sy1xJ/jvqtrilMHo1tu0i68alt/Kh/6ii+qE7OmVNj6wyzva9ViMNjH3AdhEr0MXIaGtvWUN14LYhugody/wnkoXgisuMfRwbsUdmN88IAAAAASUVORK5CYII=`}
        />
      </div>
    )
  }

  generatePaymentOptions() {
    return (
      <div style={comStyles().icons}>
        <img
          className='icon icons8-Visa'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAD4klEQVRoQ+1ZbUhTURh+Li7KDBW0DHK1yjRo0GxBNIPU+mNQSRAKQfWj1heUgfYBSj8UgpQ+/BFh/ighqH9WUFDkBzQxaLTAqMTAWkEfiptYGly58Z55LufO3XDbrU25Bwa75+685/l43/deziTM8iHNcvwwCSTaQdMB04E4FTBTKE4B414+zYHMo502y6R0RQIcAGxx72BMgEEF8MkpyunAjZJBMaSGAAMvS68kCZnG7GtsFEVBQLYohSIJDYHsQ53tkiTtNnZbY6MpinJ/qLWknEcNI9A1kqzqCzIM/rhZvDIigcWHuxRj9fo30X7cLFaF1zhgEvg3gk+Lajrwn4TW3WbuO5A+bww7lvegctVTKFN9qW9kFeq8xzSqDFzbgvTUFDaXd8qDthN2uPIz2HV502v09AeQnmqBe9syFBVksg+NPv8Y7vZ8Q8uzz2o8V34m2qvXq9fO8y/gH56I6MKMHbCmfcWjvXeQIz9hgQ50X8Bjv4t9L3Nk4/bxdew7gTl56x066jbCbk1jc0vc3Qw8gbJbF00D0vLsC2rvDajzzQfXotKVo14fuP4Gj31D8RGg1e5tuWgo9gDv3Wh+ux8N3n0sqLghV/t7y1Z2b3R8EnmnnmtI9vQHcelB6DWGCJG6HKA1awG8FzdpwDY+/IjGh5rXHvX+jB3gm3XUOYFvbfC/aYXzbj0LxNPHP/wbzvO9DBT7HQACW97kQ81OG2p2rmBz4YqLaPnviHjwlwxr1nw1RiQLoiIggh3pv4yCJqdG2dp7H1guiznMwYbnted9AKQs1YY4uBi0jtwoc2QxImuqPPGnEEW4fdzOgkIOoPBcL87uKVTzlYp3dFzWqM1J0VrRBY5GTI9K11I0Hyxgt0rrvUwc7ppeIUftAKuDitVsE8p36jbUfXjx6tUEB0yqNlTkhUSYGgSWuhEv/D7/T5TWv9Q4qVfIURMQ85s25V1F3KC92qG2UD3lwgufuPDW+Wl4Av6hCWQstKjx9Qo5agJiHXAFefHya/GZQC2USFZszgHlfXBcRkaqBWd22dg8FeuGc73MFbF1hic8bwbh8zERUOtgKpqoDvX7gWtFuh1IBEDgqUNRkfLWSekj9nyqA3qe6BVyTATEYiNAYpqI3YbXBYE4sj1XTStyjEDSsyC86MNzXSz8SOkYE4GI/SxBkyaBBAmvbms6kLQOZB/uDEiQQi/0SToURfk41FqinhjOrYOt0LkofMnqggIlKKfAoXu0SFkTOh/FVQAOSZJCL/MJHpQ2oMNdC6r+eribYJwxbW/+wRGTbAYuMh0wUMyYQpkOxCSbgYtMBwwUM6ZQfwB9JwtPN7IXrwAAAABJRU5ErkJggg==`}
        />
        <img
          className='icon icons8-MasterCard'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAADYUlEQVRoQ+1ZXUiTURh+vm0mUaQ3m4MgJ04iwzT7EcHU/sj4LprRhdSNlnW1IkHIiy698Mq8WFAWelUERSol/YeTiUSgA8sunH8QsVykpoFW7ouzsbEf9+075zszje/AYLD353ne9z3nvO+ZgA2+hA2OHxqBf51BLQNaBlRGQCshlQFUrR6XgUrbM4sE/w0ARRBgUe2BhwEJUwDcAnQNfd0nyffwiiIQBL8yDEHI5OGXuw1JmhOg3xtJIopAeXVvtwCc4u6Yo0EJ6OnvEm0hk1EEKmxPZ9dt9EOIJUw5u8Wc1QlU90ocg5UyU84uMRz46AwoJFC19BqFv0eQ92cC1pWJAFCvLgvDaQVwGwrwYvOxOPBV+W9RuP0j8oyTsJqC+9AzY8GYLweuiRIMjB9UTJiZQNnyIOw/78Ds/yrrjJBxbLkIV3opynLfwV7eCXPGjLzOvAmO/jq4xkuSEmEiYF9sx5mlnqTGIwVeHT2C44cHqHQeDom42X9BVoeaAAv49/v34YDtAxX4kPCjYREOZ2ISVARI2TQvNDMBCSudNQD5eiob159cS1hOVAQefK+D2S9fv0mRkWuxMT2pWKSAd96Ems5bq+ooJkBOm6ZF0lUoXyNZu1Fw2aNcQUYyURYUE2haaEXV8hsqMEOHilB84hOVTiLh56OVaHl5Je5nxQTuztphXZnkAgYMZUTuifr7rewE+r6JfMCHrDTT7QOiVtn2eI0JMICUi5IqAiwlNFWbA4v1C5fMeXzZqL8Xf4go3gMsmzgh8l064FwaFTHVm5jlGE2I8LQBKOZzmSnOAAHDcpH5Lplh3DFLFe1YYe8PI2o6bqu7yIg2SysxmrkT+Y1Roys1GW6tBPHM0syFEZfqAdFARYBrMxfyzEJizJqLvNrPXMETY1R7INJ7cKBpT9rceXUmtGxtgHvTnuBAU9EB8zafLBFS8w7n+dQNNLFEyn4NwhoYKYOtBhklvXoTXJtKA5NY7CJEyMdKRkrjdOBncs57yEg5XqIIeMgmcwaoaiGFwnIE5gBkpNA3D9PTzi4x/GL4fz1sBZ4WBb97HWdhXpB0RQmfFkl+CQm/4G8TyOMukM0j5xxsTEuAWyfprso+7nJwtOYmtD841jzkMQ61DGgZUBkBrYRUBlC1+obPwF+oe3NAh5c6swAAAABJRU5ErkJggg==`}
        />
        <img
          className='icon icons8-Paycheque-Filled'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACuElEQVRoQ+1ZS3LaQBDtFnLwLuQEMVWRtpYtH8A5QewTxGyMWNk+geEE1g7IBnIC4xOQAyBb2QpXQU4QL00hqVMzRIlCKjD6EYWIdU9Pv/f6TTeAsCUf3BIcUADJm5KFIoUiGTFQtFZGxMZOuz2KHHWcBwDUYlORi4Nk41FnTLmoJWERBZCEBKZ+vFAkdUoTJvw/FHElOrDPVTshWb8d1z44muzjQ5p5Vyryt4GMDIUPbJERkd/WImiNGkqTA2mPm4BwvUrBXALxEa7u64oZLnwdmI20VlRPuGX5lV2rPi3WJ4CRoR5ovUlFnrlf/6RKLoEse0PEK7lsraDww+74UiK4EXndcgmEgPqWodYYANaWJQ8HiPD6nzP7omCyXdo5tRvVKfNHaeb2EeBdLI8sHyKCL+uYEWkD0RgCeALEmlV/M1g3T4RaK/wcau3JXgnnAwTcFy0oalwmZveJavcNtc/7tTepsGeRS/3s2iSB6b+Q+/KzqxGSmRa44PnVOw5fjyxD1RI9v0T00WqoZ4sk8yH/SkzwdtRQPi2zvFDKu/SoxAdZCV1zVU+vUin9gUhylZlNbzt9RHzPLQg0tQy1yhVatNnQk+B0ebkMVOOeImi5u7IJ8/me8LKI0BzVlRb3Rnd8DQR8XYlldrY0soPLl/+U/tFEoAsCuLMM5YTF6h2nByjdMYPq3ccT8v3Kj9aMuPWKDMIAmJDZwyyEiw72n7CP9PZ4CggvvbJcZX4KvCXP3FsAOI5qfNH4yEBYm4S20mNAGIZ9E/y8xIaaV965Yg8BIN1k/ZNTIiCHbedMQuwFk1jvOBcI+MvWKspo0rjoQL5PXO4dnN9mzbQowBhARFNvNq4Aslm+19+GbA1Ia7VYf102EQT0eXv+VsiGo81nLRTZPOerbywUKRTJiIGitTIiNnbarVHkGzGYiVRupH7SAAAAAElFTkSuQmCC`}
        />
        <img
          className='icon icons8-Cash-in-Hand-Filled'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFc0lEQVRoQ91aQXLaSBR9XxaDd0lOMLjKsB0SmLXtE4Q5wZjNGFYTnyDkBMErSDYmJwg5QfAeYs0Wucr4BGPvJmWJP9WSGktC6paAYFdYupvWf+r/33v/Y8JP8qGfBAeeBJBq77q0Q/dv3WLh1Gru3a7ycp8EkHrf/grgkIFbEDUnJ/vDvGAeHcirD/Ybg/E+HDiDB3lv51GB+CnlXBLwnIn+YHCJGB0CnjF4RkzNcbs8ynI7jwqk3p9eAlRl4MukVW6IgKsfp9WdOQYE+i0A0B23yqc6MI8GpN6zOyC8ZcaNu2tW40Uu130AbDkGmtZfFSsN0KMAEW/dnNOlHyOO0tLHux2XhkT41dtL6IxPyu+SwGwdSPX8+rn5/f6rn1J0Nmntv1Gljdi/893tEPjvYN/IYbNptfdm4e9tHUitf9UVQTH4H7dYOEzTDQEgvFbv2YdMGPpEgFuAO5NW5UyC2SoQEQwIQjPgGPwyLedrH64axPxZBOwafCT3+bfjDAh47Wclhm7RbArAWwPiB3F/SaASGO/G7XInLaXqPXsEwkFQQ0t7BVAwC0D+7RA1twak1rc/E9AQKTVpVaqikAugZyLYe9e8Ced86EbuiNFIIoOIBgFftgJEBuanAw8AaggRjN4IW0xGd3Ky/0nqCQqFWVoNSUfAwJ1bNEs/HEiQ19fLgaclFltOsXCkMo9xRyC82Q8B4ukE02swNwTN6lQ5vh4v8vj6g8l8oO+NAPG1wTlgiMBx6BX02p/km0lzBGsBkX0EgY5VcYs8FgyTG1uM3VSOYGUgETpVo7gI7IVPpzk+IsUmrfIL+RVpMpPoe2UgMk91N+GyWTXhDBa6kANIoCOeFws7AkHf8WNWApLUDCXFNyecfjspdxd5Lfie0XV2TUuwkqf0gHDBqbclzjDmsHSOIDeQMPWpb8MXPqkJO2yU0lrYqGWPqQvoDJi/1jmC3ECkQusyJMlLBXX1XpCDyH8idKUtr/VtoQWeh4oLpUfhjItxuyxuMPGTC0hYodW3sWzPfcbBeVxXpJWPMFIcilBvNqtx6x7elhlIVoVO6vgCCy68VsyWeA52wUz1vs2qWlO9vMxAsqZUvON71ZseG0TnqiDGrbIXRxKQcD+/NpBwH6GrDa9HYPNUpEGtPz3XiiXzp0m7cizbWoBHIOPWb758Q5hlaKe9kczCF0LoFTJ4pvNZXqCx3E8yhLqXJ9a1QKQQZTks7x4xy4pTcmjquBgRZTk3AiSYKR0QcCzHL+m0mOX49D0cpFR4h25EpKyR3z/aBzz3OrdG2LVKWsxSrHkhJTFb1hFRqo7U+lMrNNULZ7o1blVeBhb937zBqvYnieXD1FE/Iko6m1Q14LC5F7BPCtgV4CUMHrKOiJSppaLWuOlbIezoVxJsRtYRke7ZXrHX+raYCy01PlKMVPZB94Dwurxh+bc8IyLdc3wgvemAiP5M2uwUzRdCkGo9e7aYwepOTV2PDqOlYMoR0crHSh1RMZPkehVYXQDiZsGoihchx50g4yaYJt65Bh+qJu268xeCqGImyfdZnW/8oXLGK/4eG0Z7W2UdZglWWexyMTKmDJMweDZpVfZWoWHPgsTednjcqesx8oBbKLuqfZW8n0vlGRfOrtlIMnxekf9333VR6Kh6jJWAKJkp4P5MvTrjYg4efGtXBnkCWXdvxGulMxP7Kt+7LpnkXEceyhDjnhEbZLm/7IyyWO51g076fhRI8CNMIg0vVP6qy8SzOfFoXabZJKAokOAHlqQHzJmb206XPECX+pG0vjlry5nn4ZvcuwRExUyyt95kAJs6awlIXOVF7wCiIQijVf5HZFOB6s5ZAhJM2IdMNHhqBZ1J2XWIn/r6/w6HeGz499VPAAAAAElFTkSuQmCC`}
        />
        <img
          className='icon icons8-Speaker-Phone-Filled'
          width='30'
          height='30'
          src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACgklEQVRoQ+1aS3LaQBB9DaJY2jlBcBViayWwj3ID38BkE8TKyQksnyDxCvDG8g2SG3AAFJMtUGV8gjhLVwSdaidQlKsEmk9STmpmy3TPe93vzQiNCBZHcHmz791nrwCEAAIG1whUkyUYPCfQHMAYwHAU+Z8tLg2ykSzo3dQ8yk4YaBOwXyQnA3cEJBl75+PugRA0GsZEWoPpKRjxCgWDvxLTJ6l6Bm++AvlAFpl0J2TiIwIdrpET4lHHPzNhYkSk1Z9cAxQ8SIf5aoFKXLS6QqyMHzERHf8iwOOsWnk9fnNwp0PIiEizN0kACgloj7r+UAdAqzcNGUgYHH/pNhKdHBJjREQSiMEfV7E5mB2Dl2L4cNPsIjdQaZh26le6gPPijIlsJm4OZkfg5YcV+LxFZQcDld6nnbp4ycqwSuRlb9IuEV0y41akskRluDb7xSQoLRAQKCbCc/FU2m20rbCwIa3HQIKLSTB+25CzIndI52x2w4pHbFXUNI9VaZmCMYnXIvL7UeRU5STfBXJ90le9M52zRItIsz/7SOCTXeB0fmfQeRrV36nGahKZfiv6TKUKSDqTRv4z1TgtIq3+lFUXUpk/inxlXMoBAsgRKdiWv94RnQW3cVl1WievkbR0FnREdsjSdUQK5KSVIxNndt3/IyaVc7uW27W2VMBJa4c8TArkDkR3IP4h7zlpOWk5aW3fu51HnEecR5xH8itg8nD3JP9YFXxxqDxN56WG0farjLBggCNSsFDrabvexmclfpF3ISqXpd6Srret+WQ68s8Qafan8mXPnmoni8xn4Hsa+YW+MNrMp2X2/+YOUW51y/eLGGD5PstKZ6QTACWLajnWudX9CbFAr0Iv+KAaAAAAAElFTkSuQmCC`}
        />
      </div>
    )
  }

	render() {
		return (
			<div style={comStyles().container}>
				<Card fluid raised>
          <Card.Content onClick={() => this.toggleModal(true, 'virtual_tour', this.props.all_suites[0])} style={comStyles().step}>
            <div style={comStyles().number}>
              <Label circular color='blue' size='big' key={1}>1</Label>
            </div>
            <div style={comStyles().contents}>
              Watch Virtual Tours
            </div>
          </Card.Content>
          <Card.Content onClick={() => this.toggleModal(true, 'social_share')} style={comStyles().step}>
            {/*<i className='ion-ios-heart' style={comStyles().icon}></i>
            <i className='ion-android-share-alt' style={comStyles().icon}></i>*/}

            <div style={comStyles().number}>
              <Label circular color='blue' size='big' key={2}>2</Label>
            </div>
            <div style={comStyles().contents}>
              Share With Roomates
            </div>
          </Card.Content>
          <Card.Content onClick={() => this.signAndPayOnline()} style={comStyles().step}>
            {/*<i className='ion-cash' style={comStyles().icon}></i>
            <i className='ion-card' style={comStyles().icon}></i>*/}

            <div style={comStyles().number}>
              <Label circular color='blue' size='big' key={3}>3</Label>
            </div>
            <div style={comStyles().contents}>
              Sign & Pay Online
            </div>
          </Card.Content>
        </Card>
        {
          this.renderAppropriateModal(this.state.modal_name, this.state.context)
        }
			</div>
		)
	}
}

// defines the types of variables in this.props
StepByStepCard.propTypes = {
	history: PropTypes.object.isRequired,
  all_suites: PropTypes.array.isRequired,    // passed in
  building: PropTypes.object.isRequired,     // passed in
  applyToLiveAtThisBuilding: PropTypes.func.isRequired,
}

// for all optional props, define a default value
StepByStepCard.defaultProps = {

}

// Wrap the prop in Radium to allow JS styling
const RadiumHOC = Radium(StepByStepCard)

// Get access to state from the Redux store
const mapReduxToProps = (redux) => {
	return {

	}
}

// Connect together the Redux store with this React component
export default withRouter(
	connect(mapReduxToProps, {
	})(RadiumHOC)
)

// ===============================

// the JS function that returns Radium JS styling
const comStyles = () => {
	return {
		container: {
      display: 'flex',
      flexDirection: 'column',
      width: '100%',
		},
    step: {
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'row',
    },
    number: {
      width: '20%',
      minHeight: '100%',
      fontSize: '3rem',
      fontWeight: 'bold',
    },
    contents: {
      width: '80%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textAlign: 'left',
    },
    icons: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    share_div: {
      width: '100%',
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    coming_soon_div: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '50px',
    }
	}
}
