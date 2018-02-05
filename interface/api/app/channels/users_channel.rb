class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    user = User.find(data["id"])
    user.update!(current_step: data["step"])
    ActionCable.server.broadcast('users', data)
  end
end
