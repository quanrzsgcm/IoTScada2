from django.shortcuts import render

# import view sets from the REST framework
from rest_framework import viewsets
 
# import the PowerMeterDataSerializer from the serializer file
from .serializers import PowerMeterDataSerializer
 
# import the Todo model from the models file
from .models import PowerMeterData
 
# create a class for the Todo model viewsets
class PowerMeterDataView(viewsets.ModelViewSet):
 
    # create a serializer class and 
    # assign it to the TodoSerializer class
    serializer_class = PowerMeterDataSerializer
 
    # define a variable and populate it 
    # with the Todo list objects
    queryset = PowerMeterData.objects.all()