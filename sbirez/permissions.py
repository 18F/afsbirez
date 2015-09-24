from rest_framework import permissions


class ReadOnlyUnlessStaff(permissions.BasePermission):

    def has_permission(self, request, view):
        return (request.method == 'GET') or (request.user.is_staff)

    def has_object_permission(self, request, view, obj):
        return (request.method == 'GET') or (request.user.is_staff)


class IsStaffOrTargetUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all users if logged in user is staff
        return view.action != 'list' or request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # allow logged in user to view own details, allows staff to view all records
        return request.user.is_staff or obj == request.user


class IsStaffOrFirmRelatedUser(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list all firms if staff
        return (request.user.is_authenticated()
                and (not hasattr(view, 'action') or view.action != 'list')
                ) or request.user.is_staff

    def has_object_permission(self, request, view, obj):
        # allow logged in user to view view/edit own firm
        # if user has no firm, and it is a post
        # if a user is authed and is associated with the firm
        return (   request.user.is_staff
                or obj == request.user.firm
                or hasattr(obj, 'firm') and obj.firm == request.user.firm)


class HasObjectEditPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        # allow user to list proposals if staff
        return True
        # (request.user.is_authenticated() and view.action != 'list') or request.user.is_staff

    def has_object_permission(self, request, view, object):
        # allow logged in user to view view/edit proposals from firm
        # if a user is authed and is associated with the firm
        return request.user.is_staff or object.firm == request.user.firm
