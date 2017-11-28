
export const check_if_building_accessible = (label) => {
  if (label && label.toLowerCase().indexOf('sold out') > -1) {
    return false
  } else if (label && label.toLowerCase().indexOf('not yet') > -1) {
    return false
  } else {
    return true
  }
}
