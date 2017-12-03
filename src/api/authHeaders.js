
const authHeaders = () => {
  return {
    headers: {
      jwt: localStorage.getItem('cognito_student_token'),
      staff_id: localStorage.getItem('RentHero_tenant_id'),
    }
  }
}

export default authHeaders;
