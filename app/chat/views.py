import json

from django.http import HttpResponse, StreamingHttpResponse
from django.views.decorators.http import require_http_methods

from .llm import StatifyAgent


@require_http_methods(["POST"])
def chat_with_ai(request):
    data = json.loads(request.body)
    if "userInput" not in data:
        return HttpResponse({"error": "User input not provided."}, status=400)

    user_input = data.get("userInput")
    agent = StatifyAgent()

    # TODO: update this to take message history, not just the single latest message
    def response_generator():
        for token in agent.stream(user_input):
            yield f"data: {json.dumps({'token': token})}\n\n"

    return StreamingHttpResponse(response_generator(), content_type="text/event-stream")
