import React, { useState, useEffect } from 'react'

const useGapi = gapi => {
  const [_gapi, setGapi] = useState(gapi)

  useEffect(() => {
    if (!gapi) return
    gapi.load('client', () => {
      gapi.client
        .init({
          apiKey: process.env.GOOGLE_API_KEY,
          clientId: process.env.GOOGLE_CLIENT_ID,
          discoveryDocs: [
            'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest'
          ],
          scope: 'https://www.googleapis.com/auth/gmail.modify'
        })
        .then(() => {
          setGapi(gapi)
        })
    })
  }, [gapi])

  return _gapi
}

export default useGapi
