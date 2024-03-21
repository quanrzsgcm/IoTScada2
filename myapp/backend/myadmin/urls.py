from django.urls import path
from . import views

urlpatterns = [
    path('sites/<int:site_id>/', views.get_sites),  # Define your specific URL patterns
    path('sites/', views.get_sites),
    path('inverters/<int:inverter_id>/', views.get_inverters),
    path('inverters/', views.get_inverters),
    path('connections/', views.get_connection),
    path('connections/<str:connection_id>/', views.get_connection),
    path('connectionstest/', views.get_connection_new),
    
    
]
