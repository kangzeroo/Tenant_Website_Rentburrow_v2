
// for the simple baths info shown on <AvailableSuites>
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

// for the baths info shown on <SuiteCommonAreaCanvas>
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

// for the rooms info shown on <SuiteCommonAreaCanvas>
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
  })
  return rooms_summary
}

// for the Common Areas shown on <SuiteCommonAreaCanvas>
export const calculateSuiteCommonAreasSummary = (suite_amenities) => {
  let suite_common_areas_summary = {
    kitchen: 0,
    living_room: 0,
    study_den: 0,
    patio: 0,
    balcony: 0,
    ensuite_laundry: false,
    spare_rooms: 0,
    common_storage_closets: 0,
  }

  suite_amenities.forEach((am) => {
    // tracks all the standard common areas
    if (am.amenity_type === 'full_kitchen') {
      suite_common_areas_summary.kitchen += 1
    }
    if (am.amenity_type === 'partial_kitchen') {
      suite_common_areas_summary.kitchen += 0.5
    }
    if (am.amenity_type === 'living_room') {
      suite_common_areas_summary.living_room += 1
    }
    if (am.amenity_type === 'study_den') {
      suite_common_areas_summary.study_den += 1
    }
    if (am.amenity_type === 'patio') {
      suite_common_areas_summary.patio += 1
    }
    if (am.amenity_type === 'laundry') {
      suite_common_areas_summary.ensuite_laundry = true
    }
    if (am.amenity_type === 'spare_room_1' || am.amenity_type === 'spare_room_2' || am.amenity_type === 'spare_room_3' || am.amenity_type === 'spare_room_4' || am.amenity_type === 'spare_room_5') {
      suite_common_areas_summary.spare_rooms += 1
    }
    if (am.amenity_type === 'common_storage_closet_1' || am.amenity_type === 'common_storage_closet_2' || am.amenity_type === 'common_storage_closet_3' || am.amenity_type === 'common_storage_closet_4' || am.amenity_type === 'common_storage_closet_5') {
      suite_common_areas_summary.common_storage_closets += 1
    }
  })
  return suite_common_areas_summary
}

// for the quick utilities shown on <BuildingPage>
export const calculateBuildingQuickAmenities = (buildingAmenities, allSuiteAmenities) => {
  let quick_amenities = {
    elec_incl: false,
    water_incl: false,
    heat_incl: false,
    internet_incl: false,
    free_parking: false,
    paid_parking: false,
  }
  // calculate based on building amenities, which determine parking
  buildingAmenities.forEach((am) => {
    if (am.amenity_type === 'sheltered_parking' || am.amenity_type === 'indoor_parking' || am.amenity_type === 'assigned_parking') {
      quick_amenities.paid_parking = true
    }
    if (am.amenity_type === 'free_parking') {
      quick_amenities.paid_parking = false
      quick_amenities.free_parking = true
    }
  })
  // calculate based on suite amenities, which determine utilities
  allSuiteAmenities.forEach((suiteAmenities) => {
    suiteAmenities.amenities.forEach((am) => {
      if (am.amenity_type === 'free_electricity') {
        quick_amenities.elec_incl = true
      }
      if (am.amenity_type === 'free_water') {
        quick_amenities.water_incl = true
      }
      if (am.amenity_type === 'free_heating') {
        quick_amenities.heat_incl = true
      }
      if (am.amenity_type === 'free_internet') {
        quick_amenities.internet_incl = true
      }
    })
  })
  return quick_amenities
}

// for the free utilities shown on <SuiteCommonAreaCanvas>
export const calculateFreeUtilitiesForSuite = (suite_amenities) => {
  const free_utilities_summary = {
    water: false,
    electric: false,
    heating: false,
    internet: false,
  }
  suite_amenities.forEach((am) => {
    if (am.amenity_type === 'free_water') {
      free_utilities_summary.water = true
    }
    if (am.amenity_type === 'free_electricity') {
      free_utilities_summary.electric = true
    }
    if (am.amenity_type === 'free_heating') {
      free_utilities_summary.heating = true
    }
    if (am.amenity_type === 'free_internet') {
      free_utilities_summary.internet = true
    }
  })
  return free_utilities_summary
}
