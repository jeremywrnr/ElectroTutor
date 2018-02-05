class UsersChannel < ApplicationCable::Channel
  def subscribed
    stream_from "users"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    user = User.find(data["id"])
    step = Step.find(data["step"])
    if user && step
      user.update!(current_step: data["step"])
      ActionCable.server.broadcast("users", data)
    end
  end
end
