"use client"
import React, { useContext, useState } from "react";
import { Input, Button, Modal, Table, message } from "antd";
import axios from "axios";
import styles from './page.module.css'; 
import { IPInfoContext } from 'ip-info-react';

const columns = [
  {
    title: 'Campo',
    dataIndex: 'field',
    key: 'field',
  },
  {
    title: 'Valor',
    dataIndex: 'value',
    key: 'value',
  },
];

interface TableInfo {
  field: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
}

const IpLocationPage = () => {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<TableInfo[]>();
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const userInfo = useContext(IPInfoContext);

  console.log(userInfo)

  const fetchIpLocation = async () => {
    if (!ip) {
      message.error("Por favor, insira um endereço IP.");
      return;
    }

    

    setLoading(true);
    try {
      const response = await axios.get(`https://ipapi.co/${ip}/json/`);
      const locationData = [
        { field: "IP", value: response.data.ip },
        { field: "Cidade", value: response.data.city },
        { field: "Região", value: response.data.region },
        { field: "País", value: response.data.country_name },
        { field: "Latitude", value: response.data.latitude },
        { field: "Longitude", value: response.data.longitude },
        { field: "Provedor", value: response.data.org },
      ];
      setData(locationData);
      setLoading(false);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Falha ao buscar as informações de localização.");
      console.error(error);
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <h1 className={styles.title}>Busca de Localização por IP</h1> {/* Apply the local class */}
        <Input
          placeholder="Insira o endereço IP"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          style={{ width: 300, marginRight: 10 }}
        />
        <Button type="primary" onClick={fetchIpLocation} loading={loading}>
          Buscar
        </Button>
      </div>

      <Modal
        title="Informações de Localização"
        visible={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          rowKey="field"
        />
      </Modal>
    </div>
  );
};

export default IpLocationPage;
