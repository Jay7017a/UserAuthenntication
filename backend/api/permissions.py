from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """Allow object access only to owner"""

    def has_object_permission(self, request, view, obj):
        return obj.owner == request.user
