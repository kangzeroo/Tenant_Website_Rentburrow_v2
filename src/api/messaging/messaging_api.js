

export const checkIfThisLandlordHasConvo = (corporation_id, all_messages) => {
  if (!corporation_id) {
    corporation_id = 'Rentburrow_Student_Help_Chat'
  }
  return all_messages.filter((msg) => {
    return msg.corporation_id === corporation_id
  })
}
