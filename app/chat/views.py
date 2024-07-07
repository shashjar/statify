import json

from django.http import HttpResponse, JsonResponse
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
    llm_output = agent.run(user_input)

    return JsonResponse({"aiResponse": llm_output}, status=200)
