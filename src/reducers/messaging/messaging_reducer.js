// This reducer is all about the in-app live-chat
// The messaging state handles all selections within the chat system
// such as: sending a message, which corporation you are currently talking to...etc

// keep in mind the flow of messages to the staff member
// message goes in order of: from tenant-> to corporation -> to staff chat subscriptions -> to staff message inbox

import {
	ADD_MESSAGE,
	SELECT_THREAD,
	REQUEST_NOTIFICATIONS_PERMISSION,
} from '../../actions/action_types'

const INITIAL_STATE = {
	all_messages: [
		{
			message_id: 'asdkasdf9-fjashflsdfd-asjfksajsdf',
			sender_id: 'xxxxxx-ggggggg-ddddddddd',
			receiver_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			tenant_id: 'xxxxxx-ggggggg-ddddddddd',
			tenant_name: 'Hailey Summers',
			staff_id: '',
			building_id: '4a71e950-c59c-40a3-a0de-df14dec6e52d',
			building_thumbnail: 'https://rentburrow3-images.s3.amazonaws.com/bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2/4a71e950-c59c-40a3-a0de-df14dec6e52d/building_thumbnail/the-kelvin-apartments-exterior.jpg',
			building_alias: '330 Spruce St',
			corporation_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			corporation_name: 'Domus Student Housing',
			channel_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2_xxxxxx-ggggggg-ddddddddd',
			contents: 'Hi my name is Hailey, is there any space left available here? I have a group of 4 who are interested for Fall 2017.',
		},
		{
			message_id: 'askdjfljlff-dfgergh543gpps-adfsdffdsfff',
			sender_id: 'xxxxxx-ggggggg-ddddddddd',
			receiver_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			tenant_id: 'xxxxxx-ggggggg-ddddddddd',
			tenant_name: 'Hailey Summers',
			staff_id: '',
			building_id: '4a71e950-c59c-40a3-a0de-df14dec6e52d',
			building_thumbnail: 'https://rentburrow3-images.s3.amazonaws.com/bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2/4a71e950-c59c-40a3-a0de-df14dec6e52d/building_thumbnail/the-kelvin-apartments-exterior.jpg',
			building_alias: '330 Spruce St',
			corporation_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			corporation_name: 'Domus Student Housing',
			channel_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2_xxxxxx-ggggggg-ddddddddd',
			contents: 'It would be nice if there was ensuite bath?',
		},
		{
			message_id: 'asddfjsalf-sfsdfgthasdf-asdfasdfllll',
			sender_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			receiver_id: 'xxxxxx-ggggggg-ddddddddd',
			tenant_id: 'xxxxxx-ggggggg-ddddddddd',
			tenant_name: 'Hailey Summers',
			staff_id: '19cd446f-89ae-4539-a6a9-6d7df3e5aafd',
			building_id: '4a71e950-c59c-40a3-a0de-df14dec6e52d',
			building_thumbnail: 'https://rentburrow3-images.s3.amazonaws.com/bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2/4a71e950-c59c-40a3-a0de-df14dec6e52d/building_thumbnail/the-kelvin-apartments-exterior.jpg',
			building_alias: '330 Spruce St',
			corporation_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			corporation_name: 'Domus Student Housing',
			channel_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2_xxxxxx-ggggggg-ddddddddd',
			contents: 'Hello Hailey, yes there is indeed space left! We have ensuite bath only in the upper floors for this building.',
		},
		{
			message_id: 'asdkasdf9-fjas56hjhd-asjfksajsdf',
			sender_id: 'xxxxxx-ggggggg-ddddddddd',
			receiver_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			tenant_id: 'xxxxxx-ggggggg-ddddddddd',
			tenant_name: 'Hailey Summers',
			staff_id: '19cd446f-89ae-4539-a6a9-6d7df3e5aafd',
			building_id: '4a71e950-c59c-40a3-a0de-df14dec6e52d',
			building_thumbnail: 'https://rentburrow3-images.s3.amazonaws.com/bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2/4a71e950-c59c-40a3-a0de-df14dec6e52d/building_thumbnail/the-kelvin-apartments-exterior.jpg',
			building_alias: '330 Spruce St',
			corporation_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			corporation_name: 'Domus Student Housing',
			channel_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2_xxxxxx-ggggggg-ddddddddd',
			contents: 'No problem, when can I sign?',
		},
		{
			message_id: 'asdkasdf-78ashflsdfd-asjfksajsdf',
			sender_id: 'oooooooo-fffffff-cccccccc',
			receiver_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			tenant_id: 'oooooooo-fffffff-cccccccc',
			tenant_name: 'Justin Chiang',
			staff_id: '',
			building_id: '749ef20a-cace-45ba-8a0d-7706275f0763',
			building_thumbnail: 'https://rentburrow3-images.s3.amazonaws.com/bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2/749ef20a-cace-45ba-8a0d-7706275f0763/building_thumbnail/58fdbac5ab184cd18742dbb0ba517d06.jpg',
			building_alias: 'Harebare Cabin',
			corporation_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2',
			corporation_name: 'Domus Student Housing',
			channel_id: 'bf0cd5e5-7c45-4b88-9f3f-c936bdaec2f2_oooooooo-fffffff-cccccccc',
			contents: 'Hey any space left here?',
		}
	],
	current_thread: [],
	notifications_permission_asked: false
}

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case REQUEST_NOTIFICATIONS_PERMISSION:
			return {
				...state,
				notifications_permission_asked: true
			}
		case ADD_MESSAGE:
			return {
				...state,
				all_messages: state.all_messages.concat(action.payload)
			}
		case SELECT_THREAD:
			return {
				...state,
				current_thread: action.payload
			}
		default:
			return {
				...state
			}
	}
}
