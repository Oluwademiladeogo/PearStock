from pearmonieServer.models import CustomUser, Products
from rest_framework import serializers


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "id",
            "email",
            "password",
            "phone_number",
            "street_address",
            "city",
            "state_province",
            "postal_code",
            "country",
            "date_joined",
        )
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Products
        fields = [
            "id",
            "name",
            "model",
            "type",
            "store",
            "price",
            "image",
            "stock",
            "user",
        ]
        read_only_fields = ["user"]