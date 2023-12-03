from django.urls import path
from . import views

urlpatterns = [
    path('my-api/', views.my_api_view, name='my_api_view'),
    path('my-api/things/', views.proxy_view, name='proxy_view'),
    path('my-api/create-things/', views.create_powermeter_twin, name='create_things'),
    path('my-api/test/', views.specific_element, name='specific_element'),
]