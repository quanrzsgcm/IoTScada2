from django.urls import path
from . import views

urlpatterns = [
    path('accounts/', name='my_api_view'),
]