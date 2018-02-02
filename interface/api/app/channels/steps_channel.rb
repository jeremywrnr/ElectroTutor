class StepsChannel < ApplicationCable::Channel
  def subscribed
    stream_from "steps"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    step = Step.find(data["id"])
    #step.update!(step: data["step"])
    ActionCable.server.broadcast('steps', data)
  end
end
