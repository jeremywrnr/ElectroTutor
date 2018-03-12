class ProgressDataChannel < ApplicationCable::Channel
  def subscribed
    stream_from "progress_data"
  end

  def unsubscribed
    # Any cleanup needed when channel is unsubscribed
  end

  def receive(data)
    prog = ProgressDatum.find(data['id'])
  end
end
