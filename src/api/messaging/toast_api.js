
export const getInitialToastMessages = (location) => {
  // const example_toast = {
  //   id: 'alsdfjasf',
  //   title: 'Alert!',
  //   text: 'This is a toast message',
  //   color: 'blue',
  //   link: 'https://localhost:8081/contact',
  //   icon: 'phone'
  // }
  // console.log(location)
  if (location.pathname === '/') {
    return [
      {
        id: 'signed-already',
        title: 'Successfully Signed A Lease?',
        text: 'Let us know so we can send you your house warming gift!',
        color: 'blue',
        icon: 'home',
        link: 'https://renthero.ca/contact'
      },
      // {
      //   id: 'new-building',
      //   title: 'New Buildings Filmed Every Week',
      //   text: 'Be sure to check back often',
      //   color: 'blue',
      //   icon: 'home'
      // }
    ]
  } else if (location.pathname.indexOf('sublet') > -1) {
    return [
      {
        id: 'sublets-did-you-know',
        title: 'You Can Find 12 Month Leases Too!',
        text: 'Click here to start home hunting',
        color: 'blue',
        icon: 'home',
        link: 'https://renthero.ca/lease'
      }
    ]
  } else {
    return []
  }
}
