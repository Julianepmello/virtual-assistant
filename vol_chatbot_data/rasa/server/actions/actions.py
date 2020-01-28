# import re
# from rasa_sdk import Action
# from rasa_sdk.forms import FormAction
# from rasa_sdk.interfaces import Tracker
# from rasa_sdk.executor import CollectingDispatcher
# from typing import Dict, Text, Any, List, Union
# from rasa_sdk.events import FollowupAction, SlotSet


# class ActionJoke(Action):
#     def name(self):
#         return "action_joke"

#     def run(self, dispatcher, tracker, domain):
#         # make an api call
#         # extract a joke from returned json response
#         print('OEÇOAHSFLIASFÇIASDÇLAJSDÇIASDDÇLASJDÇAISDJSCBBSICJPOICJAÇOIHCASOCIJ')
#         print('OEÇOAHSFLIASFÇIASDÇLAJSDÇIASDDÇLASJDÇAISDJSCBBSICJPOICJAÇOIHCASOCIJ')
#         print('OEÇOAHSFLIASFÇIASDÇLAJSDÇIASDDÇLASJDÇAISDJSCBBSICJPOICJAÇOIHCASOCIJ')
#         print('OEÇOAHSFLIASFÇIASDÇLAJSDÇIASDDÇLASJDÇAISDJSCBBSICJPOICJAÇOIHCASOCIJ')
#         dispatcher.utter_message("hjahdjk")
#         return []


from typing import Dict, Text, Any, List, Union

from rasa_sdk.forms import FormAction
from rasa_sdk.executor import CollectingDispatcher
from rasa_sdk.interfaces import Action, Tracker
from rasa_sdk.events import SlotSet, Restarted
from rasa_sdk.events import FollowupAction

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from string import Template
import json
import os
import re
from make_txt import make_txt_conversation


def read_template(filename):
    with open(filename, mode='r', encoding='utf-8') as template_file:
        template_file_content = template_file.read()
    return Template(template_file_content)


class ActionChangeField(Action):
    def name(self):
        return "action_change_field"

    def run(self, dispatcher, tracker, domain):
        ent = tracker.latest_message['entities'][0]['entity'] if len(tracker.latest_message['entities']) > 0 else None

        print(str(tracker.latest_message['entities']))
        # ent = unidecode(ent) if ent != None else None
        # Mod_direto é um vetor de validação para entrar no modo de
        # criação de documento direto
        if ent is None:
            dispatcher.utter_message("Esse campo não está disponível " +
                                     "para alteração")
            return[]
        elif "name_user" in ent:
            return [SlotSet("user_name", None)]
        elif "email" in ent:
            return [SlotSet("user_email", None)]
        elif "number_contact" in ent:
            return [SlotSet("user_number_contact", None)]
        elif "message" in ent:
            return [SlotSet("user_message", None)]
        else:
            dispatcher.utter_message("Esse campo não está disponível " +
                                     "para alteração")
            return[]


class InformContact(FormAction):

    def name(self):
        return "form_inform_contact"

    def required_slots(self, tracker: Tracker) -> List[Text]:
        return["user_name", "user_email", "user_number_contact",
               "confirm_message", "user_message"]

    def submit(self, dispatcher: CollectingDispatcher, tracker: Tracker,
               domain: Dict[Text, Any],) -> List[Dict]:
        # Define what the form has to do after all required slots are filled
        return [FollowupAction("action_sent_contact")]

    def slot_mappings(self) -> Dict[Text, Union[Dict, List[Dict]]]:
        return {
            "user_name": [self.from_text()],
            "user_email": [self.from_text()],
            "user_number_contact": [self.from_text()],
            "confirm_message": [self.from_intent(intent='affirmative',
                                value=True),
                                self.from_intent(intent='negative',
                                value=False),
                                self.from_text()],
            "user_message": [self.from_text()],
            }

    def validate_user_name(self, value, dispatcher, tracker: Tracker, domain):
        return {"user_name": value}

    def validate_user_email(self, value, dispatcher, tracker: Tracker, domain):
        regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$'
        # regex2 = "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"

        if(re.search(regex, value)):
            return {"user_email": value}
        else:
            dispatcher.utter_message("Desculpe, mas esse email não é válido")
            return{"user_email": None}

    def validate_user_number_contact(self, value, dispatcher, tracker: Tracker,
                                     domain):
        regex = "^\(?\d{2}\)?[\s-]?[\s9]?\d{4}-?\d{4}$"
        regex2 = "(\(?\d{2}\)?\s)?(\d{4,5}\-?\d{4})"

        if(re.search(regex, value) or re.search(regex2, value)):
            return {"user_number_contact": value}
        else:
            dispatcher.utter_message("Desculpe, mas esse número não é válido")
            return{"user_number_contact": None}

    def validate_confirm_message(self, value, dispatcher, tracker: Tracker,
                                 domain):
        if value is True:
            return{"confirm_message": True,
                   "user_message": None}
        elif value is False:
            return{"confirm_message": False,
                   "user_message": False}
        else:
            dispatcher.utter_message("Desculpa, mas não entendi. Vou te " +
                                     "perguntar de novo")
            return{"confirm_message": None}

    def validate_user_message(self, value, dispatcher, tracker: Tracker,
                              domain):
        return{"user_message": value}


class ActionRestart(Action):
    def name(self):
        return "action_restart_conversation"

    def run(self, dispatcher, tracker, domain):
        return[Restarted()]
        # Reiniciar a conversa


class ActionFillSlotCanceled(Action):
    def name(self):
        return "action_fill_slot_canceled"

    def run(self, dispatcher, tracker, domain):
        ent = tracker.latest_message['intent'].get('name')
        print(str(tracker.latest_message['intent']))
        dispatcher.utter_message("Pronto, cancelei o envio. Você quer saber " +
                                 "mais alguma coisa sobre a Kyros?")
        if "affirm" in ent or "acknowledge" in ent:
            return [SlotSet("canceled", True)]
        elif "deny" in ent:
            return [SlotSet("canceled", False)]


class SentContact(Action):
    def name(self):
        return "action_sent_contact"

    def run(self, dispatcher, tracker, domain):
        try:
            name = tracker.get_slot("user_name")
            email = tracker.get_slot("user_email")
            number_contact = tracker.get_slot("user_number_contact")
            message = tracker.get_slot("user_message")

            if message is False or message is None:
                message = "Não informado"
            # Mensagem a ser enviada
            message_template = read_template('message.txt')

            s = smtplib.SMTP(host='smtp.gmail.com', port=587)
            s.starttls()
            s.login('juliamello373@gmail.com', '1511#Chocolate')

            names_email = ['Júlia']
            email_send = ['juliam@kyros.com.br']

            if os.path.exists("data.json"):
                os.remove("data.json")

            with open("data.json", "w") as write_file:
                json.dump(tracker.current_state(), write_file)

            make_txt_conversation('data.json')

            # For each contact, send the email
            for names_email, email_send in zip(names_email, email_send):
                msg = MIMEMultipart()       # create a message
                sub={'PERSON_NAME': name.title(), 'USER_NAME': name.title(),
                        'USER_EMAIL': email, 'USER_NUMBER': number_contact}
                
                # add in the actual person name to the message template
                message = message_template.substitute(PERSON_NAME= 'Olá', USER_NAME= name.title(), 
                                                    USER_EMAIL=str(email), USER_NUMBER=str(number_contact),
                                                    USER_MESSAGE=str(message))

                # setup the parameters of the message
                msg['From']= 'juliamello373@gmail.com'
                msg['To']=email_send
                msg['Subject']="Usuário entrou em contato"

                # add in the message body
                msg.attach(MIMEText(message, 'plain'))
                
                # add txt file
                f = open("conversa_bot.txt", "r")
                attachment = MIMEText(f.read())
                attachment.add_header('Content-Disposition', 'attachment', filename='conversa_bot.txt')           
                msg.attach(attachment)

                # send the message via the server set up earlier.
                s.send_message(msg)
                
                del msg
            
            # dispatcher.utter_message("Já enviei o seus dados para um de nossos colaboradores. Entraremos em contato em breve")
            dispatcher.utter_template("utter_sent_contact", tracker)
            dispatcher.utter_message("Posso ajudar em mais alguma coisa? 😄")
                
            print("Email enviado com sucesso!!")
            return[FollowupAction('action_restart_conversation')]
        
        except:
            dispatcher.utter_message("Desculpe, mas ocorreu um erro e não consegui enviar o email")
            return[]

