from django.urls import path
from .views import RegisterView, RetrieveUserView, ChangeUserTimezoneView

urlpatterns = [
  path('register', RegisterView.as_view()),
  path('me', RetrieveUserView.as_view()), 
  path('ctz', ChangeUserTimezoneView.as_view()), 
]