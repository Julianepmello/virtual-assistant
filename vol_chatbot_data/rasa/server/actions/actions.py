from rasa_sdk import Action
from rasa_sdk.forms import FormAction
from rasa_sdk.interfaces import Tracker
from rasa_sdk.executor import CollectingDispatcher
from typing import Dict, Text, Any, List, Union
from rasa_sdk.events import FollowupAction, SlotSet

from typing import Dict, Text, Any, List, Union

import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from string import Template
import json
import os
import re
from .make_txt import make_txt_conversation


def read_template(filename):
    with open(filename, mode='r', encoding='utf-8') as template_file:
        template_file_content = template_file.read()
    return Template(template_file_content)


class ActionJoke(Action):
    def name(self):
        return "action_joke"

    def run(self, dispatcher, tracker, domain):
        # make an api call
        # extract a joke from returned json response
        dispatcher.utter_message("hjahdjk")
        return []


class ActionChangeField(Action):
    def name(self):
        return "action_change_field"

    def run(self, dispatcher, tracker, domain):
        #Action para possibilitar a alteração de um campo já preenchido no form de informação de contato.
        #A partir da entidade detectada na última mensagem do usuário, atualiza o slot correspondente 
        #com None, forçando assim que formulário refaça a pergunta e preencha novamente o slot
        
        #Detecção das informações da entidade
        ent = tracker.latest_message['entities'][0]['value'] if len(tracker.latest_message['entities']) > 0 else None
        # ent = unidecode(ent) if ent != None else None

        print(str(tracker.latest_message['entities']))
        # ent = unidecode(ent) if ent != None else None
        
        #Verificaçaõ de qual slot deve ser apagado (atualizado para None)
        if ent is None:
            dispatcher.utter_message("Esse campo não está disponível " +
                                     "para alteração")
            return[]
        elif "nome" in ent.lower():
            return [SlotSet("user_name", None)]
        elif "email" in ent.lower() or "e-mail" in ent.lower():
            return [SlotSet("email", None)]
        elif "telefone" in ent.lower() or "número" in ent.lower() or "numero" in ent.lower():
            return [SlotSet("number_contact", None)]
        elif "mensagem" in ent.lower():
            return [SlotSet("user_message", None)]
        else:
            dispatcher.utter_message("Esse campo não está disponível " +
                                     "para alteração")
            return[]


class InformContact(FormAction):

    def name(self):
        return "inform_contact_form"

    @staticmethod
    def required_slots(tracker: Tracker) -> List[Text]:
        return["user_name", "email", "number_contact",
               "confirm_message", "user_message"]

    def submit(self, dispatcher: CollectingDispatcher, tracker: Tracker,
               domain: Dict[Text, Any],) -> List[Dict]:
        # Define what the form has to do after all required slots are filled
        return [SlotSet("canceled", False),FollowupAction("action_sent_contact")]

    def slot_mappings(self) -> Dict[Text, Union[Dict, List[Dict]]]:
        return {
            "user_name": [self.from_entity(entity="name_user"),
                self.from_text(not_intent=['change_contact','cancel','ask_faq_kyros','ask_faq_owners','ask_faq_foundation','ask_faq_services_consulting','ask_faq_products_kyts',
                                    'ask_faq_services_allocation','ask_faq_services','ask_faq_projects','ask_faq_products','ask_faq_partners','ask_faq_clients',
                                    'ask_faq_mission','ask_faq_vision','ask_faq_values','ask_faq_address','ask_faq_contact','ask_faq_schedule','ask_faq_jobs',  
                                    'ask_faq_emailRH','ask_faq_products_geojuris','ask_faq_products_klonner','ask_faq_products_agroeyes','ask_faq_products_pergamo',
                                    'ask_faq_products_sua_comanda','ask_faq_services_support','ask_faq_services_mobility','ask_faq_services_testing_factory',
                                    'ask_faq_services_software_factory'])],
            "email": [self.from_entity(entity="email"),
                        self.from_text(not_intent=['change_contact','cancel','ask_faq_kyros','ask_faq_owners','ask_faq_foundation','ask_faq_services_consulting','ask_faq_products_kyts',
                                    'ask_faq_services_allocation','ask_faq_services','ask_faq_projects','ask_faq_products','ask_faq_partners','ask_faq_clients',
                                    'ask_faq_mission','ask_faq_vision','ask_faq_values','ask_faq_address','ask_faq_contact','ask_faq_schedule','ask_faq_jobs',  
                                    'ask_faq_emailRH','ask_faq_products_geojuris','ask_faq_products_klonner','ask_faq_products_agroeyes','ask_faq_products_pergamo',
                                    'ask_faq_products_sua_comanda','ask_faq_services_support','ask_faq_services_mobility','ask_faq_services_testing_factory',
                                    'ask_faq_services_software_factory'])],
            "number_contact": [self.from_entity(entity="number_contact"),
                self.from_text(not_intent=['change_contact','cancel','ask_faq_kyros','ask_faq_owners','ask_faq_foundation','ask_faq_services_consulting','ask_faq_products_kyts',
                                    'ask_faq_services_allocation','ask_faq_services','ask_faq_projects','ask_faq_products','ask_faq_partners','ask_faq_clients',
                                    'ask_faq_mission','ask_faq_vision','ask_faq_values','ask_faq_address','ask_faq_contact','ask_faq_schedule','ask_faq_jobs',  
                                    'ask_faq_emailRH','ask_faq_products_geojuris','ask_faq_products_klonner','ask_faq_products_agroeyes','ask_faq_products_pergamo',
                                    'ask_faq_products_sua_comanda','ask_faq_services_support','ask_faq_services_mobility','ask_faq_services_testing_factory',
                                    'ask_faq_services_software_factory'])],
            "confirm_message": [self.from_intent(intent='affirmative',
                                value=True),
                                self.from_intent(intent=['negative',
                                    'ask_faq_kyros','ask_faq_owners','ask_faq_foundation','ask_faq_services_consulting','ask_faq_products_kyts',
                                    'ask_faq_services_allocation','ask_faq_services','ask_faq_projects','ask_faq_products','ask_faq_partners','ask_faq_clients',
                                    'ask_faq_mission','ask_faq_vision','ask_faq_values','ask_faq_address','ask_faq_contact','ask_faq_schedule','ask_faq_jobs',  
                                    'ask_faq_emailRH','ask_faq_products_geojuris','ask_faq_products_klonner','ask_faq_products_agroeyes','ask_faq_products_pergamo',
                                    'ask_faq_products_sua_comanda','ask_faq_services_support','ask_faq_services_mobility','ask_faq_services_testing_factory',
                                    'ask_faq_services_software_factory'],
                                value=False),
                              self.from_text(not_intent=['change_contact','cancel','ask_faq_kyros','ask_faq_owners','ask_faq_foundation','ask_faq_services_consulting','ask_faq_products_kyts',
                                    'ask_faq_services_allocation','ask_faq_services','ask_faq_projects','ask_faq_products','ask_faq_partners','ask_faq_clients',
                                    'ask_faq_mission','ask_faq_vision','ask_faq_values','ask_faq_address','ask_faq_contact','ask_faq_schedule','ask_faq_jobs',  
                                    'ask_faq_emailRH','ask_faq_products_geojuris','ask_faq_products_klonner','ask_faq_products_agroeyes','ask_faq_products_pergamo',
                                    'ask_faq_products_sua_comanda','ask_faq_services_support','ask_faq_services_mobility','ask_faq_services_testing_factory',
                                    'ask_faq_services_software_factory'])],
            "user_message": [self.from_text(not_intent=['change_contact', 'cancel'])]
            }   

    def validate_user_name(self, value, dispatcher, tracker: Tracker, domain):
        return {"user_name": value}

    def validate_email(self, value, dispatcher, tracker: Tracker, domain):
        #Validação do email com um regex
        
        regex = '^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,6})+$'
        # regex2 = "(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"

        if(re.search(regex, value)):
            return {"email": value}
        else:
            dispatcher.utter_message("Desculpe, mas esse email não é válido")
            return{"email": None}

    def validate_number_contact(self, value, dispatcher, tracker: Tracker,
                                domain):
        #Validação do número de telefone do usuário
        #Site para testar regex: https://regexr.com/
        
        #Regex para números fixos ou móveis (com ou sem 9), com ou sem DDI e DDD, 
        #considernado presença de espaços, traços e parênteses
        regex = "^(\(?\s?\+?55\s?\)?)?\s?((\(?\s?\d{2}\s?\)?\s?)?([\s9]\s?)?(\d{4}[\s-]?\d{4}))$"

        if re.search(regex, value):
            return {"number_contact": value}
        else:
            dispatcher.utter_message("Desculpe, mas esse número não é válido. Tente no formato (xx)xxxx-xxxx")
            return{"number_contact": None}

    def validate_confirm_message(self, value, dispatcher, tracker: Tracker,
                                 domain):
        #Validação do slot referente ao desejo de enviar uma mensagem ao comercial
        
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
        #Validação da mensagem: não tem nenhuma
        
        return{"user_message": value}


class ActionFillSlotCanceled(Action):
    
    def name(self):
        return "action_fill_slot_canceled"

    def run(self, dispatcher, tracker, domain):
        #Preenchimento do slot referente ao cancelamento
        
        ent = tracker.latest_message['intent'].get('name')
        print(str(tracker.latest_message['intent']))
        if "affirm" in ent or "acknowledge" in ent:
            dispatcher.utter_message("Pronto, cancelei o envio. Você quer saber " +
                                 "mais alguma coisa sobre a Kyros?")
            return [SlotSet("canceled", True)]
        elif "deny" in ent:
            dispatcher.utter_message("Tudo bem. Vamos voltar para o envio do email.")
            return [SlotSet("canceled", False)]


class SentContact(Action):
    def name(self):
        return "action_sent_contact"

    def run(self, dispatcher, tracker, domain):
        #Action para realizar o envio do email com os dados do usuário.
        #Se não ocorreu o cancelamento do envio do email, buscam-se os slots preenchidos no formulário,
        #sendo esses utilizados para preencher uma mensagem (message_template). Além disso, através da
        #função make_txt_conversation (make_txt.py), utilizando o tracker como base, é reconstruída 
        #a interação entre o usuário e o bot, sendo esse arquivo enviado em anexo no email
        
        if tracker.get_slot("canceled") == False:
            try:
                #Busca dos slots
                name = tracker.get_slot("user_name")
                email = tracker.get_slot("email")
                number_contact = tracker.get_slot("number_contact")
                message = tracker.get_slot("user_message")

                if message is False or message is None:
                    message = "Não informado"
                
                # Mensagem a ser enviada
                message_template = Template('$PERSON_NAME, \n\nSegue abaixo os dados do usuário que entrou em contato comigo:\n\nNome: $USER_NAME\nE-mail: $USER_EMAIL\nNúmero: $USER_NUMBER\nMensagem: $USER_MESSAGE\n\nAtenciosamente, \nJaque, Inteligência Artificial da Kyros')
                
                #Configurações para envio do email
                s = smtplib.SMTP(host='smtp.gmail.com', port=587)
                s.starttls()
                s.login('juliamello373@gmail.com', '1511#Chocolate')

                #Dados de quem irá receber o email (podem ser colocadas mais de uma pessoa)
                names_email = ['Júlia']
                email_send = ['juliam@kyros.com.br']

                if os.path.exists("data.json"):
                    os.remove("data.json")

                with open("data.json", "w") as write_file:
                    json.dump(tracker.current_state(), write_file)

                #Reconstrução da conversa (salva em txt)
                make_txt_conversation('data.json')

                #Para cada contato definido, envia-se o email
                for names_email, email_send in zip(names_email, email_send):
                    msg = MIMEMultipart()       # create a message
                    sub={'PERSON_NAME': name.title(), 'USER_NAME': name.title(),
                        'USER_EMAIL': email, 'USER_NUMBER': number_contact}
                    
                    #Adicionar o nome da pessoa no template
                    message = message_template.substitute(PERSON_NAME= 'Olá', USER_NAME= name.title(), 
                                                        USER_EMAIL=str(email), USER_NUMBER=str(number_contact),
                                                        USER_MESSAGE=str(message))

                    #Configurar os parâmetros do email
                    msg['From']= 'juliamello373@gmail.com'
                    msg['To']=email_send
                    msg['Subject']="Usuário entrou em contato"

                    #Adicionar a mensagem 
                    msg.attach(MIMEText(message, 'plain'))
                    
                    #Adicionar arquivo txt em anexo
                    f = open("conversa_bot.txt", "r")
                    attachment = MIMEText(f.read())
                    attachment.add_header('Content-Disposition', 'attachment', filename='conversa_bot.txt')           
                    msg.attach(attachment)

                    # send the message via the server set up earlier.
                    s.send_message(msg)
                    
                    del msg
                
                # dispatcher.utter_message("Já enviei o seus dados para um de nossos colaboradores. Entraremos em contato em breve")
                dispatcher.utter_message("Já enviei os seus dados para um de nossos colaboradores. Entraremos em contato em breve.")
                dispatcher.utter_template("utter_ask_inform", tracker)
                    
                print("Email enviado com sucesso!!")
                return[]
            
            except:
                dispatcher.utter_message("Desculpe, mas ocorreu um erro e não consegui enviar o email")
                return[]
        else:
            dispatcher.utter_message("Desculpe, mas tive um problema e não consegui enviar o e-mail. Por favor, informe seu e-mail novamente")
            return[]

