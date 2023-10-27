# import serializers from the REST framework
from rest_framework import serializers

# import the todo data model
from .models import PowerMeterData

# create a serializer class
class PowerMeterDataSerializer(serializers.ModelSerializer):

	# create a meta class
	class Meta:
		model = PowerMeterData
		fields = ('meter_id', 'power','voltage','current','timestamp')
