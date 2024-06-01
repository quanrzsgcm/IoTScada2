from django.urls import path
from . import views

urlpatterns = [
    path('my-api/', views.my_api_view, name='my_api_view'),
    path('my-api/things/', views.proxy_view, name='proxy_view'),
    path('my-api/create-things/', views.create_powermeter_twin, name='create_things'),
    path('my-api/test/', views.specific_element_test, name='specific_element'),
    path('my-api/energy/', views.calculate_daily_energy, name='calculate_daily_energy'),
    path('my-api/main-energy/', views.handle_energy_request, name='handle_energy_request'),
    path('my-api/total-energy/', views.handle_total_energy_request, name='handle_total_energy_request'),
    path('my-api/realtimesitedata/', views.realtimesitedata, name='realtimesitedata'),
    path('my-api/testquery/', views.total_energy_view),    
    path('my-api/inverterdata/', views.inverter_activepower),    
    path('my-api/invertercontrol/', views.inverter_control),
    path('my-api/invertercount/', views.inverter_count),
    path('my-api/inverterlist/', views.inverter_list),    
    # path('my-api/invertergetpr/', views.inverter_control_get_polling_rate),
]