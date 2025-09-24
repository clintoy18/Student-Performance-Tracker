// <copyright file="ResponseModel.cs" company="Alliance Software Inc">
// Copyright (c) Alliance Software Inc. All rights reserved.
// </copyright>

namespace ASI.Basecode.Services.Utils.Response
{
    public class ResponseModel
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseModel"/> class.
        /// </summary>
        public ResponseModel()
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponseModel"/> class.
        /// </summary>
        /// <param name="data">Data to returned.</param>
        /// <param name="message">Message returned from the API.</param>
        public ResponseModel(object data, string message)
        {
            Items = data;
            Message = message;
        }

        public ResponseModel(string message)
        {
            Message = message;
        }

        public object Items { get; set; }

        public string Message { get; set; }
    }
}
