from django.urls import path
from . import views

urlpatterns = [
    path('my-api/', views.my_api_view, name='my_api_view'),
]