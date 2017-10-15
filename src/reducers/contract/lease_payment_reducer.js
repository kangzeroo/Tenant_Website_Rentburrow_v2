import {

} from '../../actions/action_types'

const INITIAL_STATE = {
  cheque: {
    tenant_name: '',
    payer_name: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    phone: '',
    email: '',
    financial_institution_fi: '',
    fi_account_number: '',
    fi_transit_number: '',
    bank_account_type: '',    // chequing, savings...etc
    type_of_service: '',      // personal, business...etc
    payment_date: '',
  },
  credit_card: {
    tenant_name: '',
    payer_name: '',
    address: '',
    province: '',
    postal_code: '',
    phone: '',
    email: '',
    credit_card_number: '',
    expiry_date: '',
    security_code: '',
    type_of_service: '',      // personal, business...etc
    payment_date: '',
  },
  amenities_per_month: {
    electricity: 0,
    water: 0,
    internet: 0,
    parking: 0,
    heating: 0,
    ac: 0,
    furniture: 0,
  },
  discounts: {
    jan: 0,
    feb: 0,
    mar: 0,
    apr: 0,
    may: 0,
    june: 0,
    july: 0,
    aug: 0,
    sept: 0,
    oct: 0,
    nov: 0,
    dec: 0,
  },
  deposits: {
    first_month: 0,
    last_month: 0,
    additional_month: 0,
    parking_pass: 0,
    key: 0,
    other: 0,
    rentburrow: 0,
  }
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case 'SOMETHING':
      return {
        ...state,
      }
		default:
			return {
				...state
			}
	}
}
