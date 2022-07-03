export class GoogleApi {
  async getAccessToken(code: string, redirect_uri: string) {
    const response = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        body: JSON.stringify({
          client_id: Deno.env.get("GOOGLE_CLIENT_ID"),
          client_secret: Deno.env.get("GOOGLE_CLIENT_SECRET"),
          code,
          grant_type: "authorization_code",
          redirect_uri,
        }),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      },
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const data = await response.json();
    const accessToken = data["access_token"];
    if (typeof accessToken !== "string") {
      throw new Error("Access token was not a string.");
    }
    return accessToken;
  }

  async getUserData(accessToken: string) {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`,
      {
        headers: {
          Authorization: `Bearer access_token ${accessToken}`,
        },
      },
    );
    if (!response.ok) {
      throw new Error(await response.text());
    }
    const userData = await response.json();

    return {
      userId: userData.sub as number,
      userName: userData.name as string,
      avatarUrl: userData.picture as string,
    };
  }
}

export const googleApi = new GoogleApi();
