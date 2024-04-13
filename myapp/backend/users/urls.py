from django.urls import path
from .views import RegisterView, RetrieveUserView, ChangeUserTimezoneView, get_profile

urlpatterns = [
  path('register', RegisterView.as_view()),
  path('me', RetrieveUserView.as_view()), 
  path('ctz', ChangeUserTimezoneView.as_view()), 
  path('profile', get_profile, name='get_profile'),
]