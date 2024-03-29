# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20180207164107) do

  create_table "progress_data", force: :cascade do |t|
    t.integer "progress_id"
    t.integer "test_id"
    t.string "state", default: "test"
    t.string "output"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["progress_id"], name: "index_progress_data_on_progress_id"
    t.index ["test_id"], name: "index_progress_data_on_test_id"
  end

  create_table "progresses", force: :cascade do |t|
    t.integer "user_id"
    t.integer "tutorial_id"
    t.integer "position"
    t.text "code", default: "// Starter code - this is a comment.\n\n\nvoid setup() {\n\n}\n\nvoid loop() {\n\n}\n"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tutorial_id"], name: "index_progresses_on_tutorial_id"
    t.index ["user_id"], name: "index_progresses_on_user_id"
  end

  create_table "steps", force: :cascade do |t|
    t.integer "tutorial_id"
    t.integer "position"
    t.text "description"
    t.string "title"
    t.string "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["tutorial_id"], name: "index_steps_on_tutorial_id"
  end

  create_table "tests", force: :cascade do |t|
    t.integer "step_id"
    t.integer "position"
    t.text "title"
    t.text "description"
    t.string "image"
    t.string "form"
    t.text "output"
    t.text "onerror"
    t.boolean "info", default: false
    t.string "jsondata", default: "{}"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["step_id"], name: "index_tests_on_step_id"
  end

  create_table "tutorials", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.text "description"
    t.string "source"
    t.string "image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_tutorials_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", null: false
    t.string "password_digest", null: false
    t.integer "current_tutorial"
  end

end
