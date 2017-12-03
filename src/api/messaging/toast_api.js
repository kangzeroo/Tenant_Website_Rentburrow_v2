
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
        id: 'new-building',
        title: 'New Buildings Filmed Every Week',
        text: 'Be sure to check back often',
        color: 'blue',
        icon: 'home'
      }
    ]
  } else if (location.pathname.indexOf('sublet') > -1) {
    return [
      {
        id: 'sublets-did-you-know',
        title: 'You Can Find 12 Month Leases Too!',
        text: 'Click here to start home hunting',
        color: 'blue',
        icon: 'home',
        link: 'https://rentburrow.com/lease'
      }
    ]
  } else {
    return []
  }
}
