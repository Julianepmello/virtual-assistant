import json
import os


def make_txt_conversation(name_file):
    
    with open(name_file, "r") as read_file:
        data = json.load(read_file)
        
    events = json.dumps(data['events'])
    events = json.loads(events)

    user_text = []
    bot_answer = []
    user_time = []
    bot_time = []

    for item in events:
        if item['event'] == 'user':
            user_time.append(item['timestamp'])
            user_text.append(item['text'])
        elif item['event'] == 'bot':
            bot_time.append(item['timestamp'])
            bot_answer.append(item['text'])

    #Função para retirar os emojis
    # def deEmojify(inputString):
    #     # return inputString.encode('ascii', 'ignore').decode('ascii') #Essa opção também retira os acentos
    #      return emoji.get_emoji_regexp().sub(r'', inputString.encode().decode('utf8'))
            
    if os.path.exists("conversa_bot.txt"):
        os.remove("conversa_bot.txt")
            
    file1 = open("conversa_bot.txt","a")
    i = 0
    j = 0
    for text in user_text:
        question = "Usuário: " + text
        file1.write(question)
        file1.write("\n\n")
        j = j+1 
        try:
            answer = "- " + bot_answer[i] + "\n\n"
            file1.write(answer)
            i = i+1
            if bot_time[i] < user_time[j]:
                answer = "- " + bot_answer[i] + "\n\n"
                file1.write(answer)
                i = i+1 
        except IndexError:
            continue