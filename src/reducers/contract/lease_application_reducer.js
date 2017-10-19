import {

} from '../../actions/action_types'

const INITIAL_STATE = {
  about_me: {
    first_name: '',
    last_name: '',
    address: '',
    contact_number_home: '',
    contact_number_cell: '',
    email: '',
    date_of_birth: '',
    gender: '',
    primary_language: '',
    secondary_language: '',
    citizenship: '',
    permanent_resident: false,
    govt_id: '',
  },
  emergancy_contact: {
    ec1_first_name: '',
    ec1_last_name: '',
    ec1_phone: '',
    ec1_email: '',
    ec1_relationship: '',
    ec2_first_name: '',
    ec2_last_name: '',
    ec2_phone: '',
    ec2_email: '',
    ec2_relationship: '',
  },
  about_me_student: {
    program: '',
    graduating_year: '',
    school: '',
    current_semester: '',
    student_card: '',
  },
  // amenities: {
  //   electricity: 0,
  //   water: 0,
  //   internet: 0,
  //   parking: 0,
  //   heating: 0,
  //   ac: 0,
  //   furniture: 0,
  // },
  // room_furniture: {
  //   chair: '',
  //   desk: '',
  //   bed: '',
  //   wardrobe: '',
  //   minifridge: '',
  //   microwave: '',
  //   mattress: '',
  //   nightstand: '',
  //   tv: '',
  //   curtains: '',
  //   other: '',
  // },
  // suite_furniture: {
  //   kitchen_stools: '',
  //   coffee_table: '',
  //   dining_table: '',
  //   couch: '',
  //   loveseat: '',
  //   tv: '',
  //   microwave: '',
  //   fridge: '',
  //   freezer: '',
  //   dishwasher: '',
  //   stovetop: '',
  //   oven: '',
  //   toaster_oven: '',
  //   curtains: '',
  // },
  witness: {
    witness_name: '',
    witness_email: '',
    witness_date: '',
  },
  guarantor: {
    first_name: '',
    last_name: '',
    address: '',
    contact_number_home: '',
    contact_number_cell: '',
    email: '',
    date_of_birth: '',
    relationship: '',
    govt_id: '',
    citizenship: '',
    permanent_resident: false,
  },
  medical: {
    allergies: '',
    medical_history: '',
    at_risk_of: '',
  },
  personality: {
    cleanliness: '',
    noise_level: '',
    sleep_time: '',
    awake_time: '',
    visitor_frequency: '',
    party_frequency: '',
    drinking_frequency: '',
    studying_frequency: '',
    pet_friendly: '',
    roommate_gender_preference: '',
    other: '',
  },
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
