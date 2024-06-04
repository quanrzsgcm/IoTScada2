from django.urls import path
from . import views

urlpatterns = [
    path('sites/<int:site_id>/', views.get_sites),  # Define your specific URL patterns
    path('sites/', views.get_sites),
    path('inverters/<int:inverter_id>/', views.get_inverters),
    path('inverters/', views.get_inverters),
    path('devices/<int:inverter_id>/', views.get_devices),
    path('devices/', views.get_devices),
    path('connections/', views.get_connection),
    path('connections/<str:connection_id>/', views.get_connection),
    path('connectionstest/', views.get_connection_new),
    path('get_token/', views.get_token),
    path('test_token/', views.test_token),
    path('create_device/', views.create_device),
    path('add_group/', views.add_group),
    path('add_tag/', views.add_tag),
    path('create_northapp/', views.create_northapp),
    path('setting_northapp/', views.setting_northapp),
    path('subscribe/', views.subscribe),
    path('tags/', views.get_tags),
    path('get_connection_ditto_neuron/', views.get_connection_ditto_neuron),
    path('connectionsnew/', views.get_connection_ditto_neuron),
    path('threshold/', views.handle_threshold),    
    
]
