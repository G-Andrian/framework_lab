export const requireAuth = async (
  request,
  reply
) => {
  if (!request.session.user) {
    return reply
      .status(401)
      .send({
        error: 'Unauthorized'
      });
  }
};