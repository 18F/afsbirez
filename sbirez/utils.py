# Utility methods for the sbirez application

# custom payload handler to add the user name and id to the jwt token.
def jwt_response_payload_handler(token, user=None):
    return {
        'token': token,
#        'id': user.data.id,
        'username': str(user),
    }
