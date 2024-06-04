from twilio.rest import Client
from twilio.base.exceptions import TwilioRestException


# account_sid = 'ACaa3ec0a9359019f4b4db8e158fc532a1'
# auth_token = '9bd01264e1e4741cf8f177c62be7deff'
client = Client(account_sid, auth_token)
try:
    client.region = 'sg1'
    client.edge = 'singapore'

    # message = client.messages.create(from_='+13144709357',body='Test NuBmer 2 for solar site',to='+84767573286')

    message = client.messages.create(to="+84767573286", from_="+13144709357",
                                    body="Hello there!")
except TwilioRestException as e:
  print(e)

print(message.sid)