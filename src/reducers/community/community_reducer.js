// This reducer is all about the in-app live-chat
// The messaging state handles all selections within the chat system
// such as: sending a message, which corporation you are currently talking to...etc

// keep in mind the flow of messages to the staff member
// message goes in order of: from tenant-> to corporation -> to staff chat subscriptions -> to staff message inbox

import {
  SELECT_LOCAL,
} from '../../actions/action_types'

const INITIAL_STATE = {
  latest_events: [
    {
      event_id: '89wuo4fosjfkahsdf',
      title: 'Bomber Wednesday',
      vendor: 'Bombershelter Pub',
      img: 'http://www.feds.ca/wp-content/blogs.dir/57/files//2012/08/Bomber-Bomber-Weds-Poster-v9-web-01.png',
      location: 'SLC, uWaterloo Campus',
      type: 'event',
      desc: '',
      time: 1501131833,
      lat: 43.47163729,
      lng: -80.5451423,
    },
    {
      event_id: '903uofe8gasjlfsakd',
      title: 'Velocity Fund Finals',
      vendor: 'Velocity',
      img: 'http://cdn.betakit.com/wp-content/uploads/2015/07/winning-teams-1-of-3-1050x700.jpg',
      location: 'QNC, uWaterloo Campus',
      type: 'event',
      desc: '',
      time: 1501391033,
      lat: 43.4712483,
      lng: -80.5441159,
    },
    {
      event_id: '2l773fysfjljsadf',
      title: 'Waterloop Unveil',
      vendor: 'Waterloop Student Design Team',
      img: 'https://static1.squarespace.com/static/56aacae205caa7065b09c6ff/t/58362c9215d5db57b197e85d/1479945365147/1479945184321.jpeg?format=2500w',
      location: 'Communitech Data Hub',
      type: 'event',
      desc: '',
      time: 1501650233,
      lat: 43.4654872,
      lng: -80.5232353,
    }
  ],
  latest_promos: [
    {
      promo_id: 'asiodufosa8uf0asdf',
      title: 'Couples Paint Night',
      price: '39.99 per couple',
      vendor: 'Elisa Board Game Cafe',
      img: 'https://img.grouponcdn.com/deal/5aPFAwerrm1ebfcbhdTf/rt-2048x1229/v1/c700x420.jpg',
      location: '110 University Ave',
      type: 'promo',
      desc: '',
      expiry: 1501391033,
      lat: 43.4733031,
      lng: -80.5332649,
    },
    {
      promo_id: '2894fuoasdjflsdajf',
      title: 'XL Pizza 3 Toppings',
      price: '12.99',
      vendor: 'Papa Johns',
      img: 'https://www.papajohns.com/static-assets/a/images/web/product/pizzas/std_TheWorks-compressed.jpg',
      location: 'Phils Plaza',
      type: 'promo',
      desc: '',
      expiry: 1501131833,
      lat: 43.4752375,
      lng: -80.52438919,
    },
    {
      promo_id: 'saomfuufmosdsjkdfajl',
      title: 'All You Can Eat Sushi',
      price: '15.99 dinner special',
      vendor: 'Itamae Sushi',
      img: 'https://img.grouponcdn.com/deal/hfefAup1zQWBE2K8sWURgS27xax/hf-846x508/v1/c700x420.jpg',
      location: '253 King St',
      type: 'promo',
      desc: '',
      expiry: 1501391033,
      lat: 43.4766346,
      lng: -80.525342,
    },
  ],
  selected_local: null,
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
    case SELECT_LOCAL:
      return {
        ...state,
        selected_local: action.payload
      }
		default:
			return {
				...state
			}
	}
}
