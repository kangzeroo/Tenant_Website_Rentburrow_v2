

export const renameRoom = (room_alias) => {
  if (room_alias) {
    if (room_alias.toLowerCase().indexOf('room') > -1) {
      return room_alias
    } else {
      return `Room ${room_alias}`
    }
  } else {
    return room_alias
  }
}

export const renameSuite = (suite_alias) => {
  if (suite_alias) {
    if (suite_alias.toLowerCase().indexOf('suite') > -1) {
      return suite_alias
    } else if (suite_alias.toLowerCase().indexOf('unit') > -1) {
      return suite_alias
    } else if (suite_alias.toLowerCase().indexOf('style') > -1) {
      return suite_alias
    } else {
      return `${suite_alias} Unit`
    }
  } else {
    return suite_alias
  }
}
