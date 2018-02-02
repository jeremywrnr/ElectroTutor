class ProgressesChannel < ApplicationCable::Channel
  def subscribed
    stream_from "progresses"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    prog = Progress.find(data["id"])
    ActionCable.server.broadcast('progresses', data)
  end
end
