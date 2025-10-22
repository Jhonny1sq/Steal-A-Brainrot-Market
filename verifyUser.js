import jwtDecode from "jwt-decode"

export async function handler(event) {
  try {
    const { token } = JSON.parse(event.body)
    const payload = jwtDecode(token)

    const googleResponse = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)
    const googleData = await googleResponse.json()
    if (!googleData.email_verified) {
      return { statusCode: 401, body: JSON.stringify({ error: "Invalid Google token" }) }
    }

    const userEmail = googleData.email
    const OWNER_EMAILS = ["plusnewyork43@gmail.com"]

    const role = OWNER_EMAILS.includes(userEmail) ? "owner" : "user"
    return {
      statusCode: 200,
      body: JSON.stringify({ email: userEmail, role })
    }
  } catch (err) {
    return { statusCode: 400, body: JSON.stringify({ error: err.message }) }
  }
}
