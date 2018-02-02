class TutorialsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "tutorials"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    tutorial = Tutorial.find(data["id"])
    ActionCable.server.broadcast('tutorials', data)
  end
end
