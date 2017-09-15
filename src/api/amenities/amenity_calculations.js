
// simply tell me how many baths there are
export const calculateSimpleSuiteBaths = (suite, all_suite_amenities) => {
  let bath_count = 0
  all_suite_amenities.forEach((amenity_summary) => {
    if (suite.suite_id === amenity_summary.suite_id) {
      amenity_summary.amenities.forEach((am) => {
        if (am.amenity_type === 'bathroom_1' || am.amenity_type === 'bathroom_2' || am.amenity_type === 'bathroom_3' || am.amenity_type === 'bathroom_4' || am.amenity_type === 'bathroom_5') {
          bath_count += 1
        }
        if (am.amenity_type === 'half_bathroom_1' || am.amenity_type === 'half_bathroom_2' || am.amenity_type === 'half_bathroom_3') {
          bath_count += 0.5
        }
        if (am.amenity_type === 'shared_bathroom_1' || am.amenity_type === 'shared_bathroom_2' || am.amenity_type === 'shared_bathroom_3') {
          bath_count += 1
        }
      })
    }
  })
  return bath_count
}

// give me a breakdown of what kind of baths there are, and how many of each
export const calculateComplexSuiteBaths = (suite, suite_amenities) => {
  let baths_summary = {
    full_baths: 0,
    half_baths: 0,
    shared_baths: 0,
  }
  suite_amenities.forEach((am) => {
    if (am.amenity_type === 'bathroom_1' || am.amenity_type === 'bathroom_2' || am.amenity_type === 'bathroom_3' || am.amenity_type === 'bathroom_4' || am.amenity_type === 'bathroom_5') {
      baths_summary.full_baths += 1
    }
    if (am.amenity_type === 'half_bathroom_1' || am.amenity_type === 'half_bathroom_2' || am.amenity_type === 'half_bathroom_3') {
      baths_summary.half_baths += 1
    }
    if (am.amenity_type === 'shared_bathroom_1' || am.amenity_type === 'shared_bathroom_2' || am.amenity_type === 'shared_bathroom_3') {
      baths_summary.shared_baths += 1
    }
  })
  return baths_summary
}

// give me a breakdown of the rooms and any potential ensuite bathrooms
export const calculateRoomsSummary = (result_of_api_calls) => {
  /*
    result_of_api_calls = {
      getRoomPage_results: {},
      getRoomAmenities_results: [],
    }
  */
  const priceOfFirstRoom = parseInt(result_of_api_calls[0].getRoomPage_results.price)
  let rooms_summary = {
    total_rooms: 0,
    total_ensuite_baths: 0,
    standard_price: priceOfFirstRoom,
    min_price: priceOfFirstRoom,
    max_price: priceOfFirstRoom,
  }
  // iterate for each room's info
  result_of_api_calls.forEach((resulting_room) => {
    rooms_summary.total_rooms += 1
    // iterate through all the resulting_rooms to get necessary data about rooms
    // resulting_room.getRoomPage_results.forEach((room) => {
      const room = resulting_room.getRoomPage_results
      // set the min price
      if (parseInt(room.price) < rooms_summary.min_price) {
        rooms_summary.min_price = parseInt(room.price)
      }
      // set the max price
      if (parseInt(room.price) > rooms_summary.max_price) {
        rooms_summary.max_price = parseInt(room.price)
      }
      // tracks if the rooms are all the same price
      if (parseInt(room.price) !== rooms_summary.standard_price) {
        rooms_summary.standard_price = 0
      }
      // iterate through all the resulting_rooms to get necessary data about ensuite baths
      resulting_room.getRoomAmenities_results.forEach((am) => {
        if (am.amenity_type === 'bathroom_1' || am.amenity_type === 'bathroom_2' || am.amenity_type === 'half_bathroom_1' || am.amenity_type === 'shared_bathroom_1') {
          rooms_summary.total_ensuite_baths += 1
        }
      })
    // })
  })
  return rooms_summary
}
