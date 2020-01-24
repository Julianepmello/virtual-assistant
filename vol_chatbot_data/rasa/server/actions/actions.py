import requests
import re
from rasa_sdk import Action
from rasa_sdk.forms import FormAction
from rasa_sdk.interfaces import Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Dict, Text, Any, List, Union
from rasa_sdk.events import FollowupAction, SlotSet


class ActionJoke(Action):
    def name(self):
        return "action_joke"

    def run(self, dispatcher, tracker, domain):
        # make an api call
        http = 'http://api.icndb.com/jokes/random'
        request = requests.get(http).json()
        # extract a joke from returned json response
        joke = request['value']['joke']
        dispatcher.utter_message(joke)  # send the message back to the user
        return []


class InformContact(FormAction):

    def name(self):
        return "form_inform_contact"

    def required_slots(self, tracker: Tracker) -> List[Text]:
        return["user_name", "user_email", "user_number_contact",
                            "confirm_message", "user_message"]

    def submit(
        self,
        dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: Dict[Text, Any],) -> List[Dict]:
        # Define what the form has to do after all required slots are filled
        return [FollowupAction("action_sent_contact"), SlotSet("canceled",
                                                               False)]

    def slot_mappings(self) -> Dict[Text, Union[Dict, List[Dict]]]:
        return {
            "user_name": [self.from_entity(entity="name_user"),
                          self.from_text(not_intent=["cancel", "change"])],
            "user_email": [self.from_entity(entity="email"),
                           self.from_text(not_intent=["cancel", "change"])],
            "user_number_contact": [self.from_entity(entity="number_contact"),
                                    self.from_text(not_intent=["cancel",
                                                               "change"])],
            "confirm_message": [self.from_intent(intent=['affirm',
                                'acknowledge'], value=True),
                                self.from_intent(intent='deny', value=False),
                                self.from_text(not_intent=["cancel",
                                                           "change"])],
            "user_message": [self.from_text(not_intent=["cancel", "change"])],
            }

    def validate_user_name(self, value, dispatcher, tracker: Tracker, domain):
        return {"user_name": value}

    def validate_user_email(self, value, dispatcher, tracker: Tracker, domain):
        regex = "^'\'w+(['\'.-]?'\'w+)*@'\'w+(['\'.-]?'\'w+)*('\'.'\'w{2,6})+$"
        # regex2 = "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"

        if(re.search(regex, value)):
            return {"user_email": value}
        else:
            dispatcher.utter_message("Desculpe, mas esse email não é válido")
            return{"user_email": None}

    def validate_user_number_contact(self, value, dispatcher,
                                     tracker: Tracker, domain):
        regex = "^'\'(?'\'d{2}'\')?['\'s-]?['\'s9]?'\'d{4}-?'\'d{4}$"
        regex2 = "('\'(?'\'d{2}'\')?'\'s)?('\'d{4,5}'\'-?'\'d{4})"

        if(re.search(regex, value) or re.search(regex2, value)):
            return {"user_number_contact": value}
        else:
            dispatcher.utter_message("Desculpe, mas esse número não é válido")
            return{"user_number_contact": None}

    def validate_confirm_message(self, value, dispatcher,
                                 tracker: Tracker, domain):
        if value:
            return{"confirm_message": True,
                   "user_message": None}
        elif not value:
            return{"confirm_message": False,
                   "user_message": False}
        else:
            dispatcher.utter_message("Desculpa, mas não entendi." +
                                     "Vou te perguntar de novo")
            return{"confirm_message": None}

    def validate_user_message(self, value, dispatcher,
                              tracker: Tracker, domain):
        return{"user_message": value}
