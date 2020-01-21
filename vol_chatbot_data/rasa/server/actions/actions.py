import requests
import json
from rasa_sdk import Action


class ActionJoke(Action):
    def name(self):
        return "action_joke"

    def run(self, dispatcher, tracker, domain):
        request = requests.get('http://api.icndb.com/jokes/random').json()  # make an api call
        joke = request['value']['joke']  # extract a joke from returned json response
        dispatcher.utter_message(joke)  # send the message back to the user
        return []
    
class ActionDefaultAskAffirmation(Action):
    """Asks for an affirmation of the intent if NLU threshold is not met."""

    def name(self) -> Text:
        return "action_default_ask_affirmation"
    
    def run(self, dispatcher, tracker, domain):
        ent = tracker.latest_message['entities'][0]['entity'] if len(tracker.latest_message['entities']) > 0 else None
        dispatcher.utter_message("A sua intençao era de: " + ent)
        return[]