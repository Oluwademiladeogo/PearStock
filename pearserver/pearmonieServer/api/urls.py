from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register(r"products", views.ProductViewSet)

urlpatterns = [
    path("login/", views.login, name="login"),
    path("signup/", views.signup, name="signup"),
    path("forgot-password/", views.forgot_password, name="forgot-password"),
    path("verify-otp/", views.verify_otp, name="verify-otp"),
    path("logout/", views.logout, name="logout"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("home/", views.home, name="home"),
    path("health/", views.health_check, name="health_check"),
    path("", include(router.urls)),
]
