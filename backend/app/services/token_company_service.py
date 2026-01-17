from tokenc.types import CompressResponse
from tokenc import TokenClient


class TokenCompanyService:
    def __init__(self, api_key: str):
        self.client = TokenClient(api_key=api_key)

    def make_request(
        self, input_text: str, aggressiveness: float = 0.5
    ) -> CompressResponse:
        response = self.client.compress_input(
            input=input_text, aggressiveness=aggressiveness
        )
        return response
