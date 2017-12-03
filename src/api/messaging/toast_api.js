
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
        title: 'New Buildings Added Every Week',
        text: 'Be sure to check back often',
        color: 'blue',
        icon: 'home'
      }
    ]
  } else {
    return []
  }
}
