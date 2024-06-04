# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client


# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
# account_sid = os.environ['TWILIO_ACCOUNT_SID']
account_sid = 'ACaa3ec0a9359019f4b4db8e158fc532a1'
# auth_token = os.environ['TWILIO_AUTH_TOKEN']
auth_token = '9bd01264e1e4741cf8f177c62be7deff'
client = Client(account_sid, auth_token)

call = client.calls.create( 
                        # url='http://demo.twilio.com/docs/voice.xml',
                        twiml='<Response><Say>Mama, just killed a man Put a gun against his head, pulled my trigger, now he dead Mama, life had just begun But now Ive gone and thrown it all away Mama, ooh, didnt mean to make you cry If Im not back again this time tomorrow Carry on, carry on as if nothing really matters!</Say></Response>',
                        to='+84767573286',
                        from_='+13144709357'
                    )

print(call.sid)
