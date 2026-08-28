import requests


class WebSiteResolver():
    def __init__(self):
        pass

    def resolve_website(self, url: str | None) -> str | None:
        if not url:
            return None

        try:
            response = requests.get(
                url,
                timeout=10,
                allow_redirects=True,
            )

            return response.url

        except requests.RequestException:
            return None
